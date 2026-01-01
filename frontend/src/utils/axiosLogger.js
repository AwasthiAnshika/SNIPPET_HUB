/**
 * Axios Logger Interceptor
 * Automatically logs all API requests and responses
 */

import axios from 'axios'
import logger from './logger.js'

/**
 * Setup axios interceptors for logging
 */
export const setupAxiosLogging = () => {
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      // Store request start time
      config.metadata = { startTime: Date.now() }

      // Log the request
      logger.logRequest(
        config.method,
        config.url,
        config.data,
        config.headers
      )

      return config
    },
    (error) => {
      logger.logError('UNKNOWN', 'axios request', error)
      return Promise.reject(error)
    }
  )

  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      // Calculate request duration
      const duration = Date.now() - response.config.metadata.startTime

      // Log the response
      logger.logResponse(
        response.config.method,
        response.config.url,
        response.status,
        response.data,
        duration
      )

      return response
    },
    (error) => {
      // Calculate request duration even on error
      const duration = error.config?.metadata?.startTime
        ? Date.now() - error.config.metadata.startTime
        : null

      if (error.response) {
        // Response received with error status
        logger.logResponse(
          error.config.method,
          error.config.url,
          error.response.status,
          error.response.data,
          duration
        )
      } else {
        // Request failed or no response
        logger.logError(
          error.config?.method || 'UNKNOWN',
          error.config?.url || 'unknown',
          error
        )
      }

      return Promise.reject(error)
    }
  )
}

export default axios
