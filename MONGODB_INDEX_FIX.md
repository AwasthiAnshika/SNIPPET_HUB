# 🔧 MongoDB Index Fix Guide

## The Problem

You're getting this error:
```
MongoServerError: text index required for $text query
```

This means MongoDB can't find the text index needed for searching.

---

## The Solution

### Method 1: Create Indexes (Recommended)

Run this command in your backend directory:

```bash
cd backend
npm run create-indexes
```

This will:
- ✅ Create text index on Snippet collection (for searching)
- ✅ Create language index (for filtering)
- ✅ Create tags index (for filtering)
- ✅ Create email unique index on User collection
- ✅ Create userId/snippetId indexes on Favorite collection
- ✅ Create ratings indexes

**Output will look like:**
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

### Method 2: Drop and Reseed

If you want to start fresh:

```bash
# Drop the database
mongo code_snippets
db.dropDatabase()
exit

# Then seed with indexes
cd backend
npm run create-indexes
npm run seed
```

### Method 3: Automatic on Startup

The backend now automatically tries to sync indexes when it starts:

```bash
cd backend
npm run dev
```

Check the logs for:
```
✅ MongoDB connected
✅ Indexes synchronized
🚀 Server started on port 4000
```

---

## What Each Index Does

### Text Index (Snippet)
**Enables fast full-text search across:**
- Title (weight: 5x)
- Description (weight: 2x)
- Tags (weight: 3x)
- Code (weight: 1x)

Used when searching for snippets.

### Language Index (Snippet)
**Enables filtering by programming language:**
- GET /api/snippets?q=test&language=javascript

### Tags Index (Snippet)
**Enables filtering by tags:**
- GET /api/snippets?tags=async

### Email Unique Index (User)
**Prevents duplicate user emails:**
- Ensures each email is unique

### User-Snippet Index (Favorite)
**Prevents duplicate favorites:**
- One user can't favorite the same snippet twice

### SnippetId-UserId Index (Rating)
**Prevents duplicate ratings:**
- One user can only rate a snippet once

---

## After Creating Indexes

### Test the Search

1. Start backend:
```bash
cd backend
npm run dev
```

2. Open another terminal, test the API:
```bash
curl "http://localhost:4000/api/snippets?q=async&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Or use the frontend:
1. Open http://localhost:5173
2. Login
3. Search for "async", "function", "promise", etc.
4. Should see results now!

---

## Troubleshooting

### Still getting "text index required" error?

**Check 1: MongoDB is running**
```bash
# Check if MongoDB is running
lsof -i :27017

# If not, start it:
mongod
# or on macOS:
brew services start mongodb-community
```

**Check 2: Database is correct**
```bash
mongo
> use code_snippets
> db.collection.getIndexes()
```

Should show:
```javascript
{
  v: 2,
  key: { _id: 1 }
},
{
  v: 2,
  key: { title: 'text', description: 'text', tags: 'text', code: 'text' },
  weights: { title: 5, description: 2, tags: 3, code: 1 },
  default_language: 'english',
  language_override: 'language',
  textIndexVersion: 3
}
```

**Check 3: Run create-indexes again**
```bash
cd backend
npm run create-indexes
```

### Indexes say they "already exist"?

That's fine! It means:
- ℹ️ Indexes already exist (code 85 error)
- No need to recreate them
- They're ready to use

### Still having issues?

**Option A: Drop collection and reseed**
```bash
mongo
use code_snippets
db.snippets.drop()
exit

cd backend
npm run seed
npm run create-indexes
```

**Option B: Reset entire database**
```bash
mongo
use code_snippets
db.dropDatabase()
exit

cd backend
npm run create-indexes
npm run seed
```

---

## How Indexes Are Created

### Automatically (on startup)
- Backend calls `syncIndexes()` on all models
- Happens when you run `npm run dev`

### Manually (from schema)
- Each model has index definitions
- Can create with `npm run create-indexes`

### From Mongoose
- Mongoose can auto-create indexes (slow)
- Backend now explicitly syncs them (faster)

---

## Commands Reference

```bash
# Create all indexes
npm run create-indexes

# Seed data (includes snippets with searchable fields)
npm run seed

# Start backend (auto-syncs indexes)
npm run dev

# Start frontend (to test search)
cd ../frontend && npm run dev

# Check MongoDB in terminal
mongo
use code_snippets
db.snippets.find().limit(1)
db.snippets.getIndexes()
```

---

## Success Indicators

When everything is working:

✅ Backend logs show "Indexes synchronized"
✅ Search returns results (not 500 error)
✅ All CRUD operations work (create, read, update, delete)
✅ No "text index required" errors

---

## Files Involved

- `/backend/scripts/createIndexes.js` - Script to create indexes
- `/backend/src/index.js` - Auto-sync indexes on startup
- `/backend/src/models/*.js` - Index definitions
- `/backend/package.json` - Added `create-indexes` script

---

**Need help?** Check the logs - they're very descriptive now with the logging system!
