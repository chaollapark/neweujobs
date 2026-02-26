#!/bin/bash
# Migrate data from MongoDB Atlas to local MongoDB
# Usage: ./scripts/migrate-atlas-to-local.sh
#
# Prerequisites:
#   - mongodump and mongorestore installed (mongodb-database-tools)
#   - Local MongoDB running (docker compose up mongo -d)
#   - Atlas URI set in .env file

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DUMP_DIR="$PROJECT_DIR/.mongo-dump"

# Load env
if [ -f "$PROJECT_DIR/.env" ]; then
  source <(grep -E '^(MONGODB_URI|MONGO_URI|MONGODB_DB_NAME)=' "$PROJECT_DIR/.env")
elif [ -f "$PROJECT_DIR/.env.production" ]; then
  source <(grep -E '^(MONGODB_URI|MONGO_URI|MONGODB_DB_NAME)=' "$PROJECT_DIR/.env.production")
fi

ATLAS_URI="${MONGODB_URI:-${MONGO_URI:-}}"
DB_NAME="${MONGODB_DB_NAME:-test}"
LOCAL_URI="mongodb://localhost:27017"

if [ -z "$ATLAS_URI" ]; then
  echo "Error: No MONGODB_URI found in .env or .env.production"
  exit 1
fi

echo "=== Migrating from Atlas to Local MongoDB ==="
echo "Database: $DB_NAME"
echo "Dump dir: $DUMP_DIR"
echo ""

# Step 1: Dump from Atlas
echo "Step 1: Dumping from Atlas..."
rm -rf "$DUMP_DIR"
mongodump --uri="$ATLAS_URI" --db="$DB_NAME" --out="$DUMP_DIR"

# Step 2: Restore to local
echo ""
echo "Step 2: Restoring to local MongoDB..."
mongorestore --uri="$LOCAL_URI" --db="$DB_NAME" --drop "$DUMP_DIR/$DB_NAME"

# Step 3: Verify
echo ""
echo "Step 3: Verifying..."
mongosh "$LOCAL_URI/$DB_NAME" --quiet --eval "
  const cols = db.getCollectionNames();
  console.log('Collections:', cols.length);
  cols.forEach(c => console.log('  ' + c + ': ' + db[c].countDocuments() + ' docs'));
"

# Cleanup
rm -rf "$DUMP_DIR"

echo ""
echo "=== Migration complete ==="
echo ""
echo "Update .env.production to use local MongoDB:"
echo "  MONGODB_URI=mongodb://mongo:27017"
echo "  MONGODB_DB_NAME=$DB_NAME"
