# 🚀 QUICK START GUIDE

## ⚡ 5-Minute Setup

### Terminal 1: Backend
```bash
cd backend
npm run dev
# Backend running at http://localhost:4000
```

### Terminal 2: Seed Data (after backend is running)
```bash
cd backend
npm run seed
# Creates 100 code snippets across 9 languages
```

### Terminal 3: Frontend (already running!)
```
Frontend is already running at:
🌐 http://localhost:5173
```

---

## 🎮 Quick Test

1. **Open http://localhost:5173**
   - See professional search interface
   - Features visible: Search bar, AI suggestions, tech stack info

2. **Click Login (top-right)**
   - Create account: `test@example.com` / `test123`
   - Or login if account exists

3. **Search**
   - Type "async" or "function" in search bar
   - Press Enter or click Search button
   - See results from backend (if seeded)

4. **Interact**
   - Click ⭐ to rate a snippet
   - Click ❤️ to favorite a snippet
   - Click "Favorites" link to see your saved snippets

5. **Logout**
   - Click user email dropdown (top-right)
   - Select Logout

---

## 📦 What's Running Now

| Component | Status | How to Access |
|-----------|--------|---------------|
| Frontend | ✅ RUNNING | http://localhost:5173 |
| Backend API | ✅ RUNNING | http://localhost:4000 |
| Redis Cache | ✅ RUNNING | localhost:6379 |
| MongoDB | ❌ NOT RUNNING | Needs to start |

---

## ⚠️ Requirements

To make everything work fully:

### 1. MongoDB (Required)
```bash
# Install MongoDB (if not installed)
# macOS: brew install mongodb-community
# Then start it:
mongod --config /usr/local/etc/mongod.conf
# Or: brew services start mongodb-community
```

### 2. Environment Variables
Create `/backend/.env` with:
```
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=mongodb://localhost:27017/code_snippets
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
NODE_ENV=development
```

---

## 🧪 Testing the Features

### Feature 1: Search & Display
- ✅ Type in search box
- ✅ Get results from database
- ✅ View snippet code and details

### Feature 2: Authentication
- ✅ Register new user
- ✅ Login/logout
- ✅ Session persists (localStorage)

### Feature 3: Rating
- ✅ Click ⭐ to rate (1-5 stars)
- ✅ Rating saved in database
- ✅ Average rating displayed

### Feature 4: Favorites
- ✅ Click ❤️ to favorite snippet
- ✅ Navigate to Favorites page
- ✅ See all your saved snippets

### Feature 5: AI Suggestions
- ✅ Click "Get AI Suggestions" button
- ✅ Get OpenAI-powered suggestions
- ✅ Suggestions based on snippet content

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank page on 5173 | Hard refresh (Cmd+Shift+R) or clear cache |
| API errors 404 | Ensure backend is running on 4000 |
| Search returns no results | Run `npm run seed` in backend |
| Login not working | Clear localStorage in console |
| Rate/Favorite buttons disabled | Login first (top-right) |
| AI suggestions fail | Set OPENAI_API_KEY in .env |

---

## 📚 File Structure Reminder

```
frontend/src/
├── main.jsx              ← App routing (SearchPage as home)
├── state/auth.jsx        ← Auth context
└── pages/
    ├── SearchPage.jsx    ← Main page (ACTIVE)
    ├── LoginPage.jsx     ← Login/Register
    └── FavoritesPage.jsx ← User's favorites

backend/src/
├── index.js              ← Express server
├── routes/
│   ├── auth.js          ← Register/login
│   ├── snippets.js      ← Search/rate/favorite
│   ├── ai.js            ← AI suggestions
│   └── me.js            ← User data
└── models/
    ├── User.js
    ├── Snippet.js
    ├── Rating.js
    └── Favorite.js
```

---

## 🎯 Success Indicators

You'll know everything is working when you see:

1. ✅ Frontend page loads (http://localhost:5173)
2. ✅ Login button works and shows form
3. ✅ Can register a new user
4. ✅ Can search for snippets (if data is seeded)
5. ✅ Can rate snippets (after login)
6. ✅ Can favorite snippets (after login)
7. ✅ Favorites page shows your saved snippets
8. ✅ Can logout successfully

---

## 🔗 Important Links

- **Frontend**: http://localhost:5173
- **Backend Health**: http://localhost:4000/health (if endpoint exists)
- **API Base**: http://localhost:4000/api
- **Project Status**: See PROJECT_STATUS.md

---

## 📞 Need Help?

Check the logs:
```bash
# Frontend logs
# → Check browser console (F12)

# Backend logs
# → Terminal where `npm run dev` is running

# Database logs
# → Check MongoDB output
```

---

**Happy coding! 🎉**
