# Task: Fix Docker Build MongoDB Connection Issue

## Problem
The Next.js build fails inside Docker because pages try to connect to MongoDB during static generation, but MongoDB isn't accessible during the build phase.

Error:
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

## Solution
Add `export const dynamic = 'force-dynamic'` to all pages that access MongoDB during render/build.

## Files to Fix

1. `src/app/sitemap.ts` - Wrap DB calls in try-catch, return empty array on failure
2. `src/app/[niche]/page.tsx` - Already has `dynamic = 'force-dynamic'` ✓
3. `src/app/best-in-brussels/*/page.tsx` - Add dynamic export
4. Any other pages that fail during build

## Steps

1. Read the error output to find all failing pages
2. For each page that accesses MongoDB:
   - Add `export const dynamic = 'force-dynamic';` at the top (after imports)
   - OR wrap DB calls in try-catch with empty fallback

3. For `sitemap.ts`:
   - Wrap each DB query in try-catch
   - Return empty array if DB unavailable
   - Add comment explaining why

4. Test the build locally:
```bash
npm run build
```

5. If build passes, commit changes.

## Important
- Don't change the actual functionality
- Just prevent build failures when DB isn't available
- The app will work correctly at runtime when DB IS available
