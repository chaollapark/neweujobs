#!/bin/bash
set -euo pipefail

DEPLOY_DIR="/data/repos/eujobs/neweujobs"
STATE_FILE="$DEPLOY_DIR/.deploy-state"
NGINX_CONF="/etc/nginx/conf.d/eujobs.conf"
BLUE_PORT=3000
GREEN_PORT=3010
HEALTH_TIMEOUT=90

cd "$DEPLOY_DIR"

# 1. Determine current active slot
ACTIVE_PORT=$(cat "$STATE_FILE" 2>/dev/null || echo "$BLUE_PORT")
if [ "$ACTIVE_PORT" = "$BLUE_PORT" ]; then
    NEW_PORT=$GREEN_PORT
    NEW_NAME="eujobs-green"
    OLD_NAME="eujobs-app"
else
    NEW_PORT=$BLUE_PORT
    NEW_NAME="eujobs-app"
    OLD_NAME="eujobs-green"
fi

echo "=== Deploy started ==="
echo "Active port: $ACTIVE_PORT -> New port: $NEW_PORT"
echo "Old container: $OLD_NAME -> New container: $NEW_NAME"

# 2. Pull latest code
echo "=== Pulling latest code ==="
git pull --ff-only origin main

# 3. Build new image
echo "=== Building new image ==="
docker compose build eujobs

# 4. Stop any leftover container with the new name
docker stop "$NEW_NAME" 2>/dev/null && docker rm "$NEW_NAME" 2>/dev/null || true

# 5. Start new container on alternate port
echo "=== Starting new container on port $NEW_PORT ==="
docker run -d \
    --name "$NEW_NAME" \
    --env-file .env.production \
    --network neweujobs_eujobs-network \
    -p "127.0.0.1:${NEW_PORT}:3000" \
    --restart unless-stopped \
    neweujobs-eujobs

# 6. Health check
echo "=== Health checking on port $NEW_PORT ==="
for i in $(seq 1 $HEALTH_TIMEOUT); do
    if wget -q --spider "http://127.0.0.1:${NEW_PORT}/" 2>/dev/null; then
        echo "Health check passed on port $NEW_PORT (attempt $i)"
        break
    fi
    if [ "$i" = "$HEALTH_TIMEOUT" ]; then
        echo "FAILED: Health check timed out after ${HEALTH_TIMEOUT}s. Rolling back."
        docker stop "$NEW_NAME" && docker rm "$NEW_NAME"
        exit 1
    fi
    sleep 1
done

# 7. Swap nginx upstream
echo "=== Swapping nginx upstream to port $NEW_PORT ==="
sed -i "s/server 127.0.0.1:[0-9]*/server 127.0.0.1:${NEW_PORT}/" "$NGINX_CONF"
nginx -t && nginx -s reload

# 8. Stop old container
echo "=== Stopping old container $OLD_NAME ==="
docker stop "$OLD_NAME" 2>/dev/null && docker rm "$OLD_NAME" 2>/dev/null || true

# 9. Update state
echo "$NEW_PORT" > "$STATE_FILE"

# 10. Cleanup old images
echo "=== Cleaning up dangling images ==="
docker image prune -f

echo "=== Deploy complete! Active port: $NEW_PORT ==="
