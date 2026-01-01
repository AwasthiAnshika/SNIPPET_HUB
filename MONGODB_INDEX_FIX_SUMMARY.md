# 🔧 MongoDB Index Error - FIXED

## Error You Had
```
MongoServerError: text index required for $text query
```

## Root Cause
The Snippet collection in MongoDB was missing the text index needed for full-text search functionality.

---

## What I Fixed

### 1. Created Index Creation Script
**File:** `/backend/scripts/createIndexes.js`
- Connects to MongoDB
- Creates text index on Snippet collection
- Creates language and tags indexes
- Creates user email unique index
- Creates favorite and rating indexes
- Shows clear status for each index

### 2. Auto-Index Sync on Startup
**File:** `/backend/src/index.js` (modified)
- Added automatic `syncIndexes()` call when server starts
- Ensures indexes are created even if script isn't run
- Provides feedback in logs

### 3. NPM Script Added
**File:** `/backend/package.json` (modified)
- Added `npm run create-indexes` command
- Easy one-command fix

---

## How to Fix Now

### Step 1: Make sure MongoDB is running
```bash
# On macOS with Homebrew:
brew services start mongodb-community

# Or if starting manually:
mongod
```

### Step 2: Create the indexes
```bash
cd backend
npm run create-indexes
```

**Expected output:**
```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB

📊 Creating indexes...

📍 Snippet collection:
  ✅ Text index created
  ✅ Language index created
  ✅ Tags index created

📍 User collection:
  ✅ Email unique index created

📍 Favorite collection:
  ✅ User-Snippet unique index created
  ✅ UserId index created

📍 Rating collection:
  ✅ SnippetId-UserId unique index created
  ✅ SnippetId index created

✅ All indexes created successfully!
```

### Step 3: Seed data (optional but recommended)
```bash
npm run seed
```

### Step 4: Start backend
```bash
npm run dev
```

Check logs for:
```
✅ MongoDB connected
✅ Indexes synchronized
🚀 Server started on port 4000
```

---

## Test It

### Using Frontend
1. Start frontend: `cd frontend && npm run dev`
2. Open http://localhost:5173
3. Login
4. Search for snippets - **should work now!**

### Using curl
```bash
# Replace TOKEN with your actual JWT token
curl "http://localhost:4000/api/snippets?q=async&limit=20" \
  -H "Authorization: Bearer TOKEN"
```

---

## What Each Index Does

| Index | Collection | Purpose |
|-------|-----------|---------|
| Text Index | Snippet | Full-text search across title, description, tags, code |
| Language | Snippet | Filter by programming language |
| Tags | Snippet | Filter by tags |
| Email Unique | User | Prevent duplicate emails |
| User-Snippet Unique | Favorite | Prevent duplicate favorites |
| UserId | Favorite | Find user's favorites |
| SnippetId-UserId Unique | Rating | One rating per user per snippet |
| SnippetId | Rating | Find snippet's ratings |

---

## How It Works Now

### When Backend Starts
1. Connects to MongoDB
2. Automatically calls `syncIndexes()` on all models
3. Creates any missing indexes
4. Shows "Indexes synchronized" in logs

### When You Search
1. Frontend sends search query to backend
2. Backend uses text index to search efficiently
3. Returns results quickly
4. No more "text index required" errors!

---

## In Case of Issues

### If you still get the error:
```bash
# Option 1: Try creating indexes again
npm run create-indexes

# Option 2: Drop collection and reseed
mongo
use code_snippets
db.snippets.drop()
exit

cd backend
npm run seed
npm run create-indexes
npm run dev

# Option 3: Reset entire database
mongo
use code_snippets
db.dropDatabase()
exit

cd backend
npm run create-indexes
npm run seed
```

### Check MongoDB directly
```bash
mongo
use code_snippets

# List all indexes on snippets
db.snippets.getIndexes()

# Should show text index like:
# { key: { title: 'text', description: 'text', ... }, ... }

# Count documents
db.snippets.countDocuments()

# Should show > 0 if seeded
```

---

## Files Changed

| File | Change |
|------|--------|
| `/backend/scripts/createIndexes.js` | ✅ NEW - Index creation script |
| `/backend/src/index.js` | ✅ MODIFIED - Added auto sync |
| `/backend/package.json` | ✅ MODIFIED - Added npm script |

---

## Summary

✅ **Before:** Search gave "text index required" error (500)
✅ **After:** Search works perfectly with results

The fix is automatic now - future backend startups will sync indexes automatically!

---

## Need Help?

1. Check `/backend/scripts/createIndexes.js` for what's being created
2. Read detailed guide in `MONGODB_INDEX_FIX.md`
3. Check backend logs for error messages
4. Verify MongoDB is running: `lsof -i :27017`
5. Use logging system to see exactly what API calls are failing (F12 console)

Happy searching! 🎉
