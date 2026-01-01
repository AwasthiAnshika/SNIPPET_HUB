# 🔍 Logging Quick Reference

## Viewing Logs

### Frontend Logs (Browser Console)
```
1. Open DevTools: F12 or Cmd+Option+I (Mac)
2. Go to Console tab
3. Make any API call and see instant logs
```

### Backend Logs (Terminal)
```
1. Terminal where you ran: npm run dev
2. All API requests appear automatically
3. Color-coded by method and status
```

---

## Frontend Logger Usage

### Auto-Logging (Built-in)
All axios calls are automatically logged:
```javascript
// No setup needed! Just make the call:
axios.get('/api/snippets?q=search')
// ↓ Automatically logged to console
```

### Manual Logging
```javascript
import logger from '@/utils/logger.js'

logger.info('User logged in', { userId: '123' })
logger.warn('API is slow', { duration: 5000 })
logger.error('Request failed', { error: 'Network error' })
logger.debug('Debug info', { data: 'value' })
```

---

## Backend Logger Usage

### Auto-Logging (Built-in)
All requests are automatically logged:
```javascript
// No setup needed! Logger middleware catches all requests
app.use(requestLogger)
```

### Output Format
```
[TIMESTAMP] METHOD URL
  Details...
  Status (Duration)
```

---

## Log Levels & Colors

| Level | Color | Use Case |
|-------|-------|----------|
| DEBUG | Gray | Diagnostic information |
| INFO | Blue | General information |
| WARN | Orange | Warning messages |
| ERROR | Red | Error messages |

---

## What's Logged

### Frontend
- ✅ Request method & URL
- ✅ Request body & headers
- ✅ Response status & data
- ✅ Duration in ms
- ✅ Error details

### Backend
- ✅ HTTP method & URL
- ✅ Query parameters
- ✅ Request body
- ✅ Auth headers (truncated)
- ✅ Response status & data
- ✅ Duration in ms
- ✅ Error details & stack

---

## Common API Logs

### Registration
```
[INFO] POST /api/auth/register
📤 {email, password}
[INFO] POST /api/auth/register - 201
✅ {token, user}
```

### Search
```
[INFO] GET /api/snippets?q=async
[INFO] GET /api/snippets?q=async - 200
📊 {data: [...]}
```

### Rate
```
[INFO] POST /api/snippets/:id/rate
📤 {value: 5}
[INFO] POST /api/snippets/:id/rate - 200
✅ {success: true}
```

### Favorite
```
[INFO] POST /api/snippets/:id/favorite
[INFO] POST /api/snippets/:id/favorite - 200
✅ {success: true}
```

---

## Console Filtering

### Browser Console
Use the search box:
- Type `GET` → See all GET requests
- Type `200` → See all successful responses
- Type `POST` → See all POST requests
- Type `ERROR` → See all errors

---

## Performance Tips

- Look for Duration values > 1000ms (slow requests)
- Check Status codes (4xx/5xx = errors)
- Monitor request frequency (too many requests?)
- Track failed requests (ERROR logs)

---

## Files Created

| File | Purpose |
|------|---------|
| `/frontend/src/utils/logger.js` | Core logger utility |
| `/frontend/src/utils/axiosLogger.js` | Axios interceptor |
| `/backend/src/middleware/logger.js` | Express middleware |
| `LOGGING_GUIDE.md` | Complete documentation |

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| No logs | Refresh page, open console |
| Too many logs | Use search filter in console |
| Can't see errors | Check ERROR level logs (red) |
| Slow requests | Look for Duration > 1000ms |
| Auth issues | Check Authorization headers |

---

## Tips

1. **Filter by URL**: Search `/api/snippets` in console
2. **Filter by Status**: Search `401` or `500` for errors
3. **Track User Actions**: See logs before/after button clicks
4. **Monitor Network**: Compare frontend + backend logs
5. **Debug Auth**: Check token in Authorization header

---

**For detailed info, see**: `LOGGING_GUIDE.md`
