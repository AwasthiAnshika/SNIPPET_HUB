/**
 * Frontend Logger Utility
 * Logs API requests and responses to browser console with timestamps
 */

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
}

const COLORS = {
  DEBUG: 'color: #888; font-weight: bold;',
  INFO: 'color: #0066cc; font-weight: bold;',
  WARN: 'color: #ff9800; font-weight: bold;',
  ERROR: 'color: #d32f2f; font-weight: bold;',
}

const logger = {
  /**
   * Log an API request
   */
  logRequest: (method, url, data = null, headers = null) => {
    const timestamp = new Date().toISOString()
    const logLevel = LOG_LEVELS.INFO

    console.group(
      `%c[${logLevel}] ${method.toUpperCase()} ${url}`,
      COLORS[logLevel]
    )
    console.log('📤 Timestamp:', timestamp)
    console.log('🔗 Method:', method.toUpperCase())
    console.log('📍 URL:', url)
    if (data) {
      console.log('📦 Data:', data)
    }
    if (headers) {
      console.log('🔐 Headers:', headers)
    }
    console.groupEnd()
  },

  /**
   * Log an API response
   */
  logResponse: (method, url, status, data = null, duration = null) => {
    const timestamp = new Date().toISOString()
    let logLevel = LOG_LEVELS.INFO

    // Determine log level based on status code
    if (status >= 400) {
      logLevel = LOG_LEVELS.ERROR
    } else if (status >= 300) {
      logLevel = LOG_LEVELS.WARN
    }

    console.group(
      `%c[${logLevel}] ${method.toUpperCase()} ${url} - ${status}`,
      COLORS[logLevel]
    )
    console.log('📥 Timestamp:', timestamp)
    console.log('✅ Status:', status)
    if (duration) {
      console.log('⏱️  Duration:', `${duration}ms`)
    }
    if (data) {
      console.log('📊 Response:', data)
    }
    console.groupEnd()
  },

  /**
   * Log an API error
   */
  logError: (method, url, error) => {
    const timestamp = new Date().toISOString()

    console.group(
      `%c[${LOG_LEVELS.ERROR}] ${method.toUpperCase()} ${url} - ERROR`,
      COLORS[LOG_LEVELS.ERROR]
    )
    console.log('❌ Timestamp:', timestamp)
    console.log('📍 URL:', url)
    console.log('🔴 Error Message:', error.message)
    if (error.response) {
      console.log('⚠️  Status:', error.response.status)
      console.log('📦 Response Data:', error.response.data)
    }
    console.log('🔍 Full Error:', error)
    console.groupEnd()
  },

  /**
   * Generic log method
   */
  log: (level, message, data = null) => {
    const timestamp = new Date().toISOString()
    const color = COLORS[level] || COLORS.INFO

    if (data) {
      console.log(`%c[${level}] ${message}`, color, data)
    } else {
      console.log(`%c[${level}] ${message}`, color)
    }
  },

  /**
   * Debug log
   */
  debug: (message, data = null) => {
    logger.log(LOG_LEVELS.DEBUG, message, data)
  },

  /**
   * Info log
   */
  info: (message, data = null) => {
    logger.log(LOG_LEVELS.INFO, message, data)
  },

  /**
   * Warning log
   */
  warn: (message, data = null) => {
    logger.log(LOG_LEVELS.WARN, message, data)
  },

  /**
   * Error log
   */
  error: (message, data = null) => {
    logger.log(LOG_LEVELS.ERROR, message, data)
  },
}

export default logger
