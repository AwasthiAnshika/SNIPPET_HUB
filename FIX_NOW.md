# 🚀 FIX MONGODB INDEX - COMMAND REFERENCE

## Copy-Paste These Commands (in order)

```bash
# Terminal 1: Make sure MongoDB is running
mongod

# Terminal 2: Navigate to backend
cd /Users/raaj_ankit_/PROJECTS/CODE_SNIPPET_PROJECT/backend

# Create the indexes (ONE TIME ONLY)
npm run create-indexes

# Seed the database with 100 snippets
npm run seed

# Start the backend
npm run dev
```

Then in Terminal 3:
```bash
# Start the frontend
cd /Users/raaj_ankit_/PROJECTS/CODE_SNIPPET_PROJECT/frontend
npm run dev
```

Then:
```
Open http://localhost:5173 in browser
Login
Search for "typescript" or any term
✅ Should work now!
```

---

## What Each Command Does

| Command | What It Does |
|---------|-------------|
| `mongod` | Starts MongoDB database |
| `npm run create-indexes` | Creates text index for search (one-time) |
| `npm run seed` | Adds 100 sample code snippets |
| `npm run dev` | Starts backend server |

---

## Expected Output

After `npm run create-indexes`:
```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB

📊 Creating indexes...

📍 Snippet collection:
  ✅ Text index created
  ✅ Language index created
  ✅ Tags index created

✅ All indexes created successfully!
```

After `npm run dev` (backend):
```
✅ MongoDB connected
✅ Indexes synchronized
🚀 Server started on port 4000
```

---

## Troubleshooting

### "mongod: command not found"
- Install MongoDB: `brew install mongodb-community`
- Or use: `brew services start mongodb-community`

### "npm run create-indexes" fails
- Make sure mongod is running first
- Check .env file has MONGO_URI (or it uses default: mongodb://localhost:27017/code_snippets)

### Still getting "text index required" error
- Did you run `npm run create-indexes`? (must do this)
- Did you restart backend after creating indexes? (must do this)
- Is MongoDB actually running? (check with: lsof -i :27017)

---

## Quick Check

To verify indexes were created, open MongoDB:
```bash
mongod  # (in another terminal)
mongo
use code_snippets
db.snippets.getIndexes()
```

You should see an index entry with: `{ title: 'text', description: 'text', ... }`

---

**DO THIS NOW** and your search will work! ✅
