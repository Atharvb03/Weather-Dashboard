<!--
  App.vue - Root Component
  
  This is the ROOT component of our application.
  All other components will be children of this component.
  
  Vue Component Structure:
  1. <template> - HTML markup (what users see)
  2. <script setup> - JavaScript logic (behavior)
  3. <style> - CSS styling (appearance)
  
  The <script setup> is a Vue 3 feature that simplifies component code.
  It's syntactic sugar that makes code more concise.
-->

<template>
  <div id="app" :class="['app-container', weatherTheme]">
    <!-- Dynamic Background with Overlay -->
    <div class="background-wrapper">
      <div 
        class="background-image" 
        :style="{ backgroundImage: `url(${currentBackground})` }"
      ></div>
      <div class="background-overlay"></div>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <!-- SECTION 1: Search Bar -->
      <div class="search-section">
        <SearchBar @search="handleSearch" />
      </div>

      <!-- Loading State -->
      <div v-if="weatherStore.loading" class="glass-card loading-card">
        <div class="spinner"></div>
        <p class="loading-text">Fetching weather data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="weatherStore.error" class="glass-card error-card">
        <div class="error-icon">⚠️</div>
        <h3>Unable to fetch weather</h3>
        <p>{{ weatherStore.error }}</p>
        <button @click="handleRefresh" class="retry-button">Try Again</button>
      </div>

      <!-- Weather Display: 2 Cards Only -->
      <div v-else-if="weatherStore.weather" class="weather-display">
        <!-- SECTION 2: Current Weather Hero Card -->
        <CurrentWeather 
          :weather="weatherStore.weather"
          @refresh="handleRefresh"
        />

        <!-- SECTION 3: 5-Day Forecast Card -->
        <Forecast v-if="weatherStore.dailyForecast.length > 0" :forecastData="weatherStore.dailyForecast" />
      </div>

      <!-- Welcome State -->
      <div v-else class="glass-card welcome-card">
        <div class="welcome-icon">🌤️</div>
        <h2>Weather Dashboard</h2>
        <p>Search for any city to get started</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useWeatherStore } from './stores/weatherStore';
import SearchBar from './components/SearchBar.vue';
import CurrentWeather from './components/CurrentWeather.vue';
import Forecast from './components/Forecast.vue';

// Import background images
import sunnyBg from './assets/backgrounds/sunny.jpg';
import rainyBg from './assets/backgrounds/rainy.jpg';
import snowyBg from './assets/backgrounds/snowy.jpg';
import cloudyBg from './assets/backgrounds/cloudy.jpg';
import nightBg from './assets/backgrounds/night.png';

const weatherStore = useWeatherStore();

// Dynamic background based on weather condition
const currentBackground = computed(() => {
  if (!weatherStore.weather) {
    return sunnyBg; // Default background
  }

  const condition = weatherStore.weather.weather[0].main.toLowerCase();
  const icon = weatherStore.weather.weather[0].icon;
  const isNight = icon.includes('n');

  // Return appropriate background image based on weather
  if (isNight) {
    return nightBg;
  } else if (condition === 'clear') {
    return sunnyBg;
  } else if (condition === 'rain' || condition === 'drizzle' || condition === 'thunderstorm') {
    return rainyBg;
  } else if (condition === 'snow') {
    return snowyBg;
  } else if (condition === 'clouds' || condition === 'mist' || condition === 'fog' || condition === 'haze') {
    return cloudyBg;
  } else {
    return sunnyBg; // Default fallback
  }
});

// Theme for text color adaptation based on background
const weatherTheme = computed(() => {
  if (!weatherStore.weather) return 'theme-default';
  
  const icon = weatherStore.weather.weather[0].icon;
  const condition = weatherStore.weather.weather[0].main.toLowerCase();
  const isNight = icon.includes('n');
  
  // Light text (white) for ALL dark backgrounds
  // This includes: night, rain, storm, clouds, snow
  if (isNight || 
      condition.includes('rain') || 
      condition.includes('drizzle') ||
      condition.includes('thunderstorm') || 
      condition.includes('cloud') ||
      condition.includes('mist') ||
      condition.includes('fog') ||
      condition.includes('snow')) {
    return 'theme-dark-bg';
  }
  
  // Dark text for bright backgrounds (only clear sunny day)
  return 'theme-light-bg';
});

const handleSearch = async (cityName) => {
  await weatherStore.fetchWeatherData(cityName);
};

const handleRefresh = async () => {
  await weatherStore.refreshWeather();
};
</script>

<style>
/* ========================================
   GLOBAL RESET & BASE STYLES
   ======================================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ========================================
   APP CONTAINER & BACKGROUND
   ======================================== */
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  min-height: 100vh;
  position: relative;
  padding: 0;
  margin: 0;
}

/* Dynamic Background System */
.background-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  transition: opacity 0.8s ease-in-out;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  transition: background 0.5s ease;
}

/* Theme Variations for Text Contrast */
.theme-light-bg .background-overlay {
  background: rgba(0, 0, 0, 0.15);
}

.theme-dark-bg .background-overlay {
  background: rgba(0, 0, 0, 0.35);
}

/* ========================================
   MAIN CONTENT LAYOUT
   ======================================== */
.main-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: 0.75rem 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* ========================================
   GLASSMORPHISM CARD BASE
   ======================================== */
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  transition: all 0.3s ease;
}

/* Adaptive Text Colors */
.theme-light-bg {
  color: #1F2937;
}

.theme-light-bg .glass-card {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.theme-dark-bg {
  color: #FFFFFF;
}

.theme-dark-bg .glass-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.theme-default {
  color: #FFFFFF;
}

/* ========================================
   SEARCH SECTION
   ======================================== */
.search-section {
  width: 100%;
  max-width: 1200px;
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

/* ========================================
   LOADING STATE
   ======================================== */
.loading-card {
  text-align: center;
  padding: 3rem 2rem;
  max-width: 400px;
  width: 100%;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1rem;
  opacity: 0.9;
}

.theme-dark .loading-text {
  color: white;
}

.theme-light .loading-text {
  color: #1a1a1a;
}

/* ========================================
   ERROR STATE
   ======================================== */
.error-card {
  text-align: center;
  padding: 3rem 2rem;
  max-width: 500px;
  width: 100%;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.error-card p {
  margin-bottom: 2rem;
  opacity: 0.8;
  line-height: 1.5;
}

.retry-button {
  padding: 0.75rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: inherit;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.retry-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* ========================================
   WEATHER DISPLAY
   ======================================== */
.weather-display {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
}

/* ========================================
   ACTION SECTION
   ======================================== */
.action-section {
  display: flex;
  justify-content: center;
  margin-top: 0.75rem;
  margin-bottom: 1rem;
}

.refresh-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  color: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.refresh-icon {
  font-size: 1.25rem;
  transition: transform 0.5s ease;
}

.refresh-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.refresh-button:hover .refresh-icon {
  transform: rotate(180deg);
}

.refresh-button:active {
  transform: translateY(0);
}

/* ========================================
   WELCOME STATE
   ======================================== */
.welcome-card {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 500px;
  width: 100%;
}

.welcome-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.welcome-card h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.welcome-card p {
  font-size: 1.1rem;
  opacity: 0.8;
  line-height: 1.6;
}

/* ========================================
   RESPONSIVE DESIGN
   ======================================== */
@media (max-width: 768px) {
  .main-content {
    padding: 1.5rem 1rem;
  }

  .glass-card {
    padding: 1.5rem;
    border-radius: 20px;
  }

  .welcome-card {
    padding: 3rem 1.5rem;
  }

  .welcome-icon {
    font-size: 3rem;
  }

  .welcome-card h2 {
    font-size: 1.75rem;
  }

  .welcome-card p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 1rem 0.75rem;
  }
}

/* ========================================
   SMOOTH TRANSITIONS
   ======================================== */
.theme-light *,
.theme-dark * {
  transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
}
</style>
