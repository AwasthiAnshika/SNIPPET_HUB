# 📊 Logging Implementation Guide

## Overview

A complete logging system has been added to both frontend and backend to track all API calls, responses, and errors.

---

## 🎯 Frontend Logging

### Files Added

1. **`/frontend/src/utils/logger.js`**
   - Core logger utility with multiple log levels (DEBUG, INFO, WARN, ERROR)
   - Color-coded console output for easy identification
   - Specific methods for request, response, and error logging

2. **`/frontend/src/utils/axiosLogger.js`**
   - Axios interceptor setup for automatic request/response logging
   - Calculates request duration
   - Captures request data, headers, and response data

### Features

- **Automatic API Logging**: All axios requests and responses are automatically logged
- **Request Duration**: Tracks how long each API call takes
- **Color-Coded Output**: Different colors for different log levels
- **Request Data**: Logs request method, URL, body, and headers
- **Response Data**: Logs response status, data, and duration
- **Error Tracking**: Comprehensive error logging with full error details

### How It Works

The logging is automatically initialized when the app starts (`main.jsx`):

```javascript
import { setupAxiosLogging } from './utils/axiosLogger.js'
setupAxiosLogging()
```

This sets up axios interceptors that automatically log every request and response.

### Console Output Examples

**Request Log:**
```
[INFO] GET http://localhost:4000/api/snippets?q=search
📤 Timestamp: 2026-01-01T12:34:56.789Z
🔗 Method: GET
📍 URL: http://localhost:4000/api/snippets?q=search
🔐 Headers: {...}
```

**Response Log:**
```
[INFO] GET http://localhost:4000/api/snippets?q=search - 200
📥 Timestamp: 2026-01-01T12:34:56.890Z
✅ Status: 200
⏱️  Duration: 101ms
📊 Response: {...}
```

**Error Log:**
```
[ERROR] POST http://localhost:4000/api/auth/login - ERROR
❌ Timestamp: 2026-01-01T12:34:57.000Z
📍 URL: http://localhost:4000/api/auth/login
🔴 Error Message: Request failed with status code 401
⚠️  Status: 401
📦 Response Data: {error: {...}}
```

### Manual Logger Usage

You can also use the logger directly in any component:

```javascript
import logger from '../utils/logger.js'

// Log different levels
logger.debug('Debug message', { optional: 'data' })
logger.info('Info message', { optional: 'data' })
logger.warn('Warning message', { optional: 'data' })
logger.error('Error message', { optional: 'data' })

// Manual API logging
logger.logRequest('GET', 'http://api.example.com/data', null, headers)
logger.logResponse('GET', 'http://api.example.com/data', 200, responseData, 150)
logger.logError('POST', 'http://api.example.com/submit', error)
```

---

## 🎯 Backend Logging

### Files Added

1. **`/backend/src/middleware/logger.js`**
   - Express middleware for request/response logging
   - Color-coded console output (terminal colors)
   - Request duration tracking
   - Body and query parameter logging

### Features

- **Automatic Request Logging**: All incoming HTTP requests are logged
- **Method Color-Coding**:
  - GET: Blue
  - POST: Green
  - PUT: Yellow
  - DELETE: Red
  - PATCH: Cyan
- **Status Code Color-Coding**:
  - 2xx: Green (success)
  - 3xx: Cyan (redirect)
  - 4xx: Yellow (client error)
  - 5xx: Red (server error)
- **Duration Tracking**: Shows how long each request took
- **Request Details**: Logs method, URL, headers, body, and query params
- **Response Details**: Logs status code, response data, and duration
- **Error Logging**: Separate error logging with stack traces

### How It Works

The logger is automatically initialized in `/backend/src/index.js`:

```javascript
const { requestLogger, errorLogger } = require('./middleware/logger');

app.use(requestLogger);  // Logs incoming requests
app.use(errorLogger);    // Logs errors
```

### Console Output Examples

**Request Log:**
```
[2026-01-01T12:34:56.789Z] GET http://localhost:4000/api/snippets?q=search
  🔐 Auth: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  🔍 Query: {"q":"search","limit":"20"}
  200 (101ms)
  📥 Response: {"success":true,"data":[...]}
```

**POST Request with Body:**
```
[2026-01-01T12:34:57.000Z] POST http://localhost:4000/api/auth/login
  📦 Body:
  {
    "email": "user@example.com",
    "password": "***"
  }
  200 (150ms)
  📥 Response: {"token":"...","user":{...}}
```

**Error Log:**
```
[2026-01-01T12:34:58.000Z] ERROR POST http://localhost:4000/api/auth/login
  ❌ Status: 401
  📝 Message: Invalid credentials
  🔍 Details: {"code":"AUTH_FAILED","reason":"password_mismatch"}
  🔴 Stack: Error: Invalid credentials...
```

---

## 📋 What Gets Logged

### Frontend

✅ **Requests**
- Method (GET, POST, PUT, DELETE, etc.)
- URL
- Request body/data
- Headers
- Timestamp

✅ **Responses**
- Status code
- Response data
- Duration in milliseconds
- Timestamp

✅ **Errors**
- Error message
- HTTP status
- Response data
- Full error object

### Backend

✅ **Incoming Requests**
- HTTP method
- Request URL
- Query parameters
- Request body
- Authorization header (truncated)
- Timestamp

✅ **Outgoing Responses**
- HTTP status code
- Response body
- Duration in milliseconds

✅ **Errors**
- Error message
- Status code
- Error details
- Stack trace (in development)

---

## 🔍 Viewing Logs

### Frontend

Open browser Developer Tools:
```
Press: F12 or Cmd+Option+I (Mac) or Ctrl+Shift+I (Windows)
```

Go to **Console** tab and you'll see all API logs with color coding.

### Backend

Logs appear in the terminal where the backend is running:
```bash
cd backend
npm run dev
# All logs will appear in this terminal
```

---

## 🎨 Log Levels & Colors

### Frontend Colors
- **DEBUG**: Gray
- **INFO**: Blue
- **WARN**: Orange
- **ERROR**: Red

### Backend Colors
- **GET**: Blue
- **POST**: Green
- **PUT**: Yellow
- **DELETE**: Red
- **PATCH**: Cyan
- **2xx Status**: Green
- **3xx Status**: Cyan
- **4xx Status**: Yellow
- **5xx Status**: Red

---

## 📊 Example Workflow Logs

### User Registration Flow

**Frontend Console:**
```
[INFO] POST http://localhost:4000/api/auth/register
📤 Timestamp: 2026-01-01T12:34:56.789Z
🔗 Method: POST
📍 URL: http://localhost:4000/api/auth/register
📦 Data: {email: "user@example.com", password: "***"}

[INFO] POST http://localhost:4000/api/auth/register - 201
📥 Timestamp: 2026-01-01T12:34:56.890Z
✅ Status: 201
⏱️  Duration: 450ms
📊 Response: {token: "eyJ...", user: {id: "...", email: "user@example.com"}}
```

**Backend Terminal:**
```
[2026-01-01T12:34:56.789Z] POST /api/auth/register
  📦 Body:
  {
    "email": "user@example.com",
    "password": "hashedPassword"
  }
  201 (450ms)
  📥 Response: {token: "eyJ...", user: {...}}
```

---

## 🔐 Security Notes

- ✅ Authorization headers are truncated in logs (only show first 30 chars)
- ✅ Passwords in request bodies are visible (only in development)
- ✅ Full stack traces only shown in development mode
- ⚠️ Be careful with sensitive data in query parameters

---

## 🚀 Testing the Logs

### 1. Open Frontend
```
http://localhost:5173
```

### 2. Open Browser Console
```
F12 → Console tab
```

### 3. Try Operations
- Click Login → See POST to /auth/register or /auth/login
- Search for snippets → See GET to /snippets
- Rate a snippet → See POST to /snippets/:id/rate
- Favorite a snippet → See POST to /snippets/:id/favorite

### 4. Watch Backend Terminal
All the same requests will appear with color-coded output in the terminal where you ran `npm run dev`

---

## 📈 Benefits

1. **Debugging**: Easily see what API calls are being made and their responses
2. **Performance**: Track how long each API call takes
3. **Error Tracking**: Quickly identify API errors and their causes
4. **Development**: Understand the flow of your application
5. **Testing**: Verify that correct API calls are being made
6. **Monitoring**: In production, helps track API usage patterns

---

## 🛠️ Customization

### Change Log Level
To disable certain log levels, modify `/frontend/src/utils/logger.js`:
```javascript
// Add a check in logRequest/logResponse methods
if (LOG_LEVEL === 'DEBUG') return // Skip debug logs
```

### Change Colors
Edit the `COLORS` object in `/frontend/src/utils/logger.js` or `/backend/src/middleware/logger.js`.

### Filter Logs
Use browser console filtering (search box in DevTools console) to filter logs by:
- URL
- Status code
- Log level
- Method

---

## 📞 Troubleshooting

**Q: I don't see any logs**
- A: Make sure setupAxiosLogging() is called in main.jsx
- A: Check browser console is open (F12)
- A: Check backend terminal is visible

**Q: Too many logs**
- A: Use browser console filter to search for specific terms
- A: Modify log levels in logger.js

**Q: Sensitive data in logs**
- A: Check authorization header truncation
- A: Avoid logging passwords (never send in request body)

---

**Last Updated**: January 1, 2026
**Version**: 1.0
