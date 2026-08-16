/**
 * Weather API Service
 * 
 * This file handles all HTTP requests to the OpenWeatherMap API using Axios.
 * It's a centralized place for API logic, making it easy to maintain and test.
 * 
 * Why Axios?
 * - Automatic JSON transformation (no need for .json())
 * - Better error handling
 * - Interceptors for logging/auth
 * - Request cancellation support
 */

import axios from 'axios';

// API Configuration
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Create an Axios instance with default configuration
 * 
 * Why create an instance?
 * - We can set default configs (baseURL, timeout, headers)
 * - We can add interceptors for logging/error handling
 * - Multiple instances possible for different APIs
 */
const weatherApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout (prevents hanging requests)
  params: {
    appid: API_KEY, // This will be added to every request automatically
    units: 'metric', // Use Celsius instead of Kelvin
  },
});

/**
 * Request Interceptor
 * Runs BEFORE every request is sent
 * 
 * Use cases:
 * - Add authentication tokens
 * - Log requests for debugging
 * - Modify request headers
 */
weatherApiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Runs AFTER every response is received
 * 
 * Use cases:
 * - Transform response data
 * - Handle errors globally
 * - Log responses
 */
weatherApiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status);
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status (404, 500, etc.)
      console.error('❌ Response Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was sent but no response received (network error)
      console.error('❌ Network Error: No response received');
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
    }
    return Promise.reject(error);
  }
);


/**
 * Get current weather data for a city
 * 
 * @param {string} city - Name of the city (e.g., "London", "New York")
 * @returns {Promise<Object>} Weather data object
 * 
 * API Endpoint: /weather
 * Example: api.openweathermap.org/data/2.5/weather?q=London&appid=xxx&units=metric
 * 
 * How Axios works here:
 * 1. axios.get() returns a Promise
 * 2. We await the Promise to get the response
 * 3. response.data contains the actual weather data
 * 4. If error occurs, it's caught by the interceptor and thrown
 */
export const getCurrentWeather = async (city) => {
  try {
    const response = await weatherApiClient.get('/weather', {
      params: { q: city }, // q = query parameter for city name
    });
    
    // response.data contains the actual weather object from API
    return response.data;
  } catch (error) {
    // Handle specific error cases
    if (error.response?.status === 404) {
      throw new Error(`City "${city}" not found. Please check the spelling.`);
    } else if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your configuration.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your internet connection.');
    } else {
      throw new Error('Failed to fetch weather data. Please try again later.');
    }
  }
};

/**
 * Get 5-day weather forecast for a city
 * 
 * @param {string} city - Name of the city
 * @returns {Promise<Object>} Forecast data object containing 40 data points (3-hour intervals)
 * 
 * API Endpoint: /forecast
 * Returns: 40 forecast items (5 days × 8 times per day)
 * 
 * Response structure:
 * {
 *   list: [ { dt, main: { temp, temp_min, temp_max }, weather: [...] }, ... ],
 *   city: { name, country }
 * }
 */
export const getForecast = async (city) => {
  try {
    const response = await weatherApiClient.get('/forecast', {
      params: { q: city },
    });
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`City "${city}" not found. Please check the spelling.`);
    } else if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your configuration.');
    } else {
      throw new Error('Failed to fetch forecast data. Please try again later.');
    }
  }
};

/**
 * Get weather data by geographic coordinates
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data object
 * 
 * Use case: Get weather for user's current location using geolocation API
 */
export const getWeatherByCoords = async (lat, lon) => {
  try {
    const response = await weatherApiClient.get('/weather', {
      params: { lat, lon },
    });
    
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch weather data for your location.');
  }
};
