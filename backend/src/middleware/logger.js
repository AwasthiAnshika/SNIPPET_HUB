/**
 * Express Logger Middleware
 * Logs all incoming HTTP requests and outgoing responses
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
}

/**
 * Get color based on HTTP status code
 */
const getStatusColor = (statusCode) => {
  if (statusCode >= 500) return colors.red
  if (statusCode >= 400) return colors.yellow
  if (statusCode >= 300) return colors.cyan
  if (statusCode >= 200) return colors.green
  return colors.white
}

/**
 * Get method color
 */
const getMethodColor = (method) => {
  const colors_map = {
    GET: colors.blue,
    POST: colors.green,
    PUT: colors.yellow,
    DELETE: colors.red,
    PATCH: colors.cyan,
    OPTIONS: colors.dim,
  }
  return colors_map[method] || colors.white
}

/**
 * Logger middleware factory
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now()

  // Log incoming request
  const methodColor = getMethodColor(req.method)
  const timestamp = new Date().toISOString()

  console.log(
    `\n${colors.bright}[${timestamp}]${colors.reset} ${methodColor}${req.method}${colors.reset} ${colors.cyan}${req.originalUrl}${colors.reset}`
  )

  // Log request headers if authentication token present
  if (req.headers.authorization) {
    const token = req.headers.authorization.substring(0, 30) + '...'
    console.log(`  🔐 Auth: ${token}`)
  }

  // Log request body if present
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`  📦 Body:`, JSON.stringify(req.body, null, 2))
  }

  // Log query parameters if present
  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`  🔍 Query:`, JSON.stringify(req.query, null, 2))
  }

  // Intercept the response
  const originalSend = res.send

  res.send = function (data) {
    const duration = Date.now() - startTime
    const statusColor = getStatusColor(res.statusCode)

    // Log outgoing response
    console.log(
      `  ${statusColor}${res.statusCode}${colors.reset} ${colors.dim}(${duration}ms)${colors.reset}`
    )

    // Log response body if present
    if (data) {
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data
        if (Object.keys(parsedData).length > 0) {
          console.log(`  📥 Response:`, JSON.stringify(parsedData, null, 2))
        }
      } catch (e) {
        // If not JSON, just log as is
        console.log(`  📥 Response:`, data)
      }
    }

    console.log(`${colors.dim}${'─'.repeat(60)}${colors.reset}`)

    // Call original send
    return originalSend.call(this, data)
  }

  next()
}

/**
 * Error logger middleware
 */
export const errorLogger = (err, req, res, next) => {
  const timestamp = new Date().toISOString()

  console.error(
    `\n${colors.red}${colors.bright}[${timestamp}] ERROR${colors.reset} ${colors.red}${req.method}${colors.reset} ${colors.cyan}${req.originalUrl}${colors.reset}`
  )
  console.error(`  ❌ Status: ${err.status || 500}`)
  console.error(`  📝 Message: ${err.message}`)

  if (err.details) {
    console.error(`  🔍 Details:`, JSON.stringify(err.details, null, 2))
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(`  🔴 Stack:`, err.stack)
  }

  console.error(`${colors.dim}${'─'.repeat(60)}${colors.reset}`)

  next(err)
}

export default requestLogger
