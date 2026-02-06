import axios from 'axios'

// Backend API base URL - change this to match your backend server
const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
})

// Request interceptor for logging and adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status}`, response.data)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message)

    // Handle specific error codes
    if (error.response) {
      switch (error.response.status) {
        case 404:
          console.error('Resource not found')
          break
        case 500:
          console.error('Server error')
          break
        default:
          console.error('API error occurred')
      }
    } else if (error.request) {
      console.error('No response from server')
    } else {
      console.error('Request setup error:', error.message)
    }

    return Promise.reject(error)
  }
)

// API Methods for Candidates

/**
 * Get all candidates
 * @returns {Promise} Array of candidates
 */
export const getAllCandidates = async () => {
  try {
    const response = await api.get('/candidates')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Get single candidate by ID
 * @param {number} id - Candidate ID
 * @returns {Promise} Candidate object
 */
export const getCandidateById = async (id) => {
  try {
    const response = await api.get(`/candidates/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Create new candidate
 * @param {Object} candidateData - Candidate data
 * @returns {Promise} Created candidate object
 */
export const createCandidate = async (candidateData) => {
  try {
    const response = await api.post('/candidates', candidateData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Update existing candidate
 * @param {number} id - Candidate ID
 * @param {Object} candidateData - Updated candidate data
 * @returns {Promise} Updated candidate object
 */
export const updateCandidate = async (id, candidateData) => {
  try {
    const response = await api.put(`/candidates/${id}`, candidateData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Delete candidate
 * @param {number} id - Candidate ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteCandidate = async (id) => {
  try {
    const response = await api.delete(`/candidates/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Health check
 * @returns {Promise} Server health status
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    throw error
  }
}

export default api
