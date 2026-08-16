/**
 * Weather Store - Pinia
 * 
 * This is the CENTRAL STATE MANAGEMENT for our weather app.
 * All weather data flows through this store.
 * 
 * Why Pinia?
 * - Centralized state (single source of truth)
 * - Reactive (components auto-update when state changes)
 * - DevTools support (time-travel debugging)
 * - Easy to test
 * 
 * How it works:
 * 1. Component calls an action: weatherStore.fetchWeather('London')
 * 2. Action calls API service: getCurrentWeather('London')
 * 3. Action updates state: this.weather = data
 * 4. All components using this state automatically re-render! ✨
 */

import { defineStore } from 'pinia';
import { getCurrentWeather, getForecast } from '../services/weatherApi';

/**
 * Define the Weather Store
 * 
 * @param {string} 'weather' - Store ID (unique identifier)
 * @param {object} configuration - Store configuration
 * 
 * Convention: Store names start with "use" (useWeatherStore, useUserStore)
 */
export const useWeatherStore = defineStore('weather', {
  
  /**
   * STATE
   * 
   * This is where we store our data.
   * Think of it as a database for the frontend.
   * 
   * IMPORTANT: state must be a FUNCTION that returns an object
   * Why? So each instance gets a fresh copy (important for SSR)
   * 
   * All properties here are REACTIVE - when they change, 
   * Vue automatically updates all components using them!
   */
  state: () => ({
    // Current searched city name
    city: null, // Example: "London"
    
    // Current weather data object from API
    weather: null, // Example: { temp: 20, humidity: 65, ... }
    
    // 5-day forecast array from API
    forecast: null, // Example: { list: [...], city: {...} }
    
    // Loading state (true when API call is in progress)
    loading: false, // Used to show spinner
    
    // Error message (null when no error)
    error: null, // Example: "City not found"
    
    // Last updated timestamp
    lastUpdated: null, // Example: Date.now()
  }),


  /**
   * GETTERS
   * 
   * Getters are COMPUTED PROPERTIES for the store.
   * They derive values from state without modifying it.
   * 
   * Think of them as:
   * - Computed properties in components
   * - SELECT queries in SQL
   * 
   * Benefits:
   * - Cached (only recalculate when dependencies change)
   * - Reusable across components
   * - Keep components clean
   * 
   * Convention: Use descriptive names (hasWeatherData, not hasData)
   */
  getters: {
    /**
     * Check if we have weather data
     * Used to conditionally render components
     */
    hasWeatherData: (state) => {
      return state.weather !== null && state.forecast !== null;
    },
    
    /**
     * Check if currently loading
     * Used to show/hide loading spinner
     */
    isLoading: (state) => {
      return state.loading;
    },
    
    /**
     * Check if there's an error
     * Used to show/hide error message
     */
    hasError: (state) => {
      return state.error !== null;
    },
    
    /**
     * Get formatted current temperature
     * Example: "20°C"
     */
    currentTemp: (state) => {
      if (!state.weather) return null;
      return `${Math.round(state.weather.main.temp)}°C`;
    },
    
    /**
     * Get weather condition (e.g., "Cloudy", "Rainy")
     */
    weatherCondition: (state) => {
      if (!state.weather) return null;
      return state.weather.weather[0].main;
    },
    
    /**
     * Get formatted city name with country
     * Example: "London, GB"
     */
    cityDisplay: (state) => {
      if (!state.weather) return state.city;
      return `${state.weather.name}, ${state.weather.sys.country}`;
    },
    
    /**
     * Get daily forecast (one entry per day)
     * OpenWeatherMap gives data every 3 hours (40 entries for 5 days)
     * We need to group by day and pick one representative time (e.g., noon)
     */
    dailyForecast: (state) => {
      if (!state.forecast) return [];
      
      // Group forecast items by date
      const dailyData = [];
      const seenDates = new Set();
      
      state.forecast.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toDateString();
        
        // Only take first occurrence of each date (or filter for noon/afternoon)
        if (!seenDates.has(date)) {
          seenDates.add(date);
          dailyData.push(item);
        }
      });
      
      // Return first 6 days (changed from 5 to 6)
      return dailyData.slice(0, 6);
    },
  },


  /**
   * ACTIONS
   * 
   * Actions are METHODS that can modify state.
   * They can be async (unlike Vuex mutations).
   * 
   * Think of them as:
   * - Methods in components
   * - INSERT/UPDATE/DELETE queries in SQL
   * 
   * Key differences from Vuex:
   * - No mutations needed! Actions can modify state directly
   * - Can be async
   * - Use 'this' to access state
   * 
   * Best practices:
   * - Keep actions focused (single responsibility)
   * - Handle errors within actions
   * - Update loading state appropriately
   */
  actions: {
    /**
     * Fetch weather data for a city
     * 
     * This is the MAIN action that orchestrates the entire flow:
     * 1. Set loading to true
     * 2. Clear previous errors
     * 3. Call API service
     * 4. Update state with results
     * 5. Handle errors
     * 6. Set loading to false
     * 
     * @param {string} cityName - Name of city to search
     */
    async fetchWeatherData(cityName) {
      // Step 1: Set loading state
      this.loading = true;
      this.error = null;
      
      try {
        // Step 2: Call both APIs in parallel (faster!)
        // Promise.all waits for all promises to complete
        // If one fails, the catch block handles it
        const [weatherData, forecastData] = await Promise.all([
          getCurrentWeather(cityName),
          getForecast(cityName),
        ]);
        
        // Step 3: Update state with successful data
        // 'this' refers to the store state
        this.city = cityName;
        this.weather = weatherData;
        this.forecast = forecastData;
        this.lastUpdated = Date.now();
        
        console.log('✅ Weather data fetched successfully:', weatherData);
        
      } catch (error) {
        // Step 4: Handle errors
        console.error('❌ Failed to fetch weather:', error);
        this.error = error.message;
        
        // Clear data on error
        this.weather = null;
        this.forecast = null;
        
      } finally {
        // Step 5: Always set loading to false (success or error)
        this.loading = false;
      }
    },
    
    /**
     * Refresh weather data for current city
     * 
     * Used by the "Refresh" button
     * Re-fetches data without changing the city
     */
    async refreshWeather() {
      if (!this.city) {
        this.error = 'No city selected. Please search for a city first.';
        return;
      }
      
      // Reuse fetchWeatherData action
      await this.fetchWeatherData(this.city);
    },
    
    /**
     * Set city without fetching data
     * Useful for initializing the search input
     */
    setCity(cityName) {
      this.city = cityName;
    },
    
    /**
     * Clear error message
     * Called when user dismisses error or starts new search
     */
    clearError() {
      this.error = null;
    },
    
    /**
     * Reset all state to initial values
     * Useful for "Clear" button or logout
     */
    resetStore() {
      this.city = null;
      this.weather = null;
      this.forecast = null;
      this.loading = false;
      this.error = null;
      this.lastUpdated = null;
    },
  },
});
