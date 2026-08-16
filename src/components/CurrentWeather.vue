<template>
  <!-- Current Weather - Floating on Background, No Card -->
  <div class="weather-content">
    <!-- Left: Location & Time -->
    <div class="weather-left">
      <div class="location-pin">
        <span class="pin-icon">📍</span>
        <h1 class="city-name">{{ weather.name }}, {{ weather.sys.country }}</h1>
      </div>
      <p class="date">{{ formattedDate }}</p>
      <div class="time">{{ formattedTime }}</div>
    </div>

    <!-- Center: Weather Icon & Condition -->
    <div class="weather-center">
      <img 
        :src="weatherIconUrl" 
        :alt="weather.weather[0].description"
        class="weather-illustration"
      />
      <p class="condition-main">{{ weather.weather[0].main }}</p>
      <p class="feels-like">Feels like {{ Math.round(weather.main.feels_like) }}°</p>
    </div>

    <!-- Right: Temperature & Refresh -->
    <div class="weather-right">
      <button @click="handleRefresh" class="refresh-btn" title="Refresh">↻</button>
      <div class="temp-labels">
        <span class="temp-label">HIGHEST</span>
        <span class="temp-value-small">{{ Math.round(weather.main.temp_max) }}°</span>
      </div>
      <div class="temp-labels">
        <span class="temp-label">LOWEST</span>
        <span class="temp-value-small">{{ Math.round(weather.main.temp_min) }}°</span>
      </div>
      <div class="temp-main">{{ Math.round(weather.main.temp) }}°C</div>
    </div>
  </div>

  <!-- Statistics Strip - Subtle Glass -->
  <div class="stats-strip">
    <div class="stat-item">
      <span class="stat-icon">💧</span>
      <div class="stat-info">
        <span class="stat-label">HUMIDITY</span>
        <span class="stat-value">{{ weather.main.humidity }}%</span>
      </div>
    </div>

    <div class="stat-separator"></div>

    <div class="stat-item">
      <span class="stat-icon">🌬️</span>
      <div class="stat-info">
        <span class="stat-label">WIND SPEED</span>
        <span class="stat-value">{{ weather.wind.speed }} m/s</span>
      </div>
    </div>

    <div class="stat-separator"></div>

    <div class="stat-item">
      <span class="stat-icon">🌡️</span>
      <div class="stat-info">
        <span class="stat-label">PRESSURE</span>
        <span class="stat-value">{{ weather.main.pressure }} hPa</span>
      </div>
    </div>

    <div class="stat-separator"></div>

    <div class="stat-item">
      <span class="stat-icon">👁️</span>
      <div class="stat-info">
        <span class="stat-label">VISIBILITY</span>
        <span class="stat-value">{{ visibilityInKm }} km</span>
      </div>
    </div>

    <div class="stat-separator"></div>

    <div class="stat-item">
      <span class="stat-icon">🕒</span>
      <div class="stat-info">
        <span class="stat-label">LAST UPDATED</span>
        <span class="stat-value">{{ formattedTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  weather: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && value.main && value.weather;
    }
  }
});

const emit = defineEmits(['refresh']);

const weatherIconUrl = computed(() => {
  const iconCode = props.weather.weather[0].icon;
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
});

const formattedDate = computed(() => {
  const date = new Date();
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
});

const formattedTime = computed(() => {
  const date = new Date();
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
});

const visibilityInKm = computed(() => {
  return (props.weather.visibility / 1000).toFixed(1);
});

const handleRefresh = () => {
  emit('refresh');
};
</script>

<style scoped>
/* Weather Content - Floating on Background */
.weather-content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2.5rem;
  align-items: center;
  justify-items: center;
  padding: 0.85rem 0;
  margin-bottom: 0.85rem;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  color: inherit;
}

/* Left Section */
.weather-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-self: start;
  width: 100%;
  color: inherit;
}

.location-pin {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.pin-icon {
  font-size: 1.25rem;
  opacity: 0.9;
}

.city-name {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: inherit;
}

.date {
  font-size: 1rem;
  opacity: 0.85;
  margin: 0;
  font-weight: 400;
  color: inherit;
}

.time {
  font-size: 2.5rem;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.02em;
  margin-top: 0.25rem;
  color: inherit;
}

/* Center Section */
.weather-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: inherit;
}

.weather-illustration {
  width: 120px;
  height: 120px;
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.15));
}

.condition-main {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
  text-transform: capitalize;
  color: inherit;
}

.feels-like {
  font-size: 0.95rem;
  opacity: 0.75;
  margin: 0;
  font-weight: 400;
  color: inherit;
}

/* Right Section */
.weather-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  position: relative;
  justify-self: end;
  width: 100%;
  color: inherit;
}

.refresh-btn {
  position: absolute;
  top: -0.5rem;
  right: 0;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.15rem;
  color: inherit;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(180deg);
}

.temp-labels {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.temp-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  opacity: 0.7;
  text-transform: uppercase;
  color: inherit;
}

.temp-value-small {
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: inherit;
}

.temp-main {
  font-size: 4rem;
  font-weight: 200;
  line-height: 1;
  letter-spacing: -0.03em;
  margin-top: 0.5rem;
  color: inherit;
}

/* Statistics Strip - Subtle Glass */
.stats-strip {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 1rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 0.85rem;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  color: inherit;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.stat-icon {
  font-size: 1.65rem;
  opacity: 0.85;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.stat-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  opacity: 0.65;
  text-transform: uppercase;
  color: inherit;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: inherit;
}

.stat-separator {
  width: 1px;
  height: 35px;
  background: rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .weather-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }

  .weather-left,
  .weather-right {
    align-items: center;
  }

  .location-pin {
    justify-content: center;
  }

  .refresh-btn {
    position: relative;
    top: 0;
    right: 0;
    margin-bottom: 0.5rem;
  }

  .stats-strip {
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }

  .stat-separator {
    display: none;
  }

  .stat-item {
    flex-basis: calc(50% - 0.5rem);
  }
}

@media (max-width: 768px) {
  .time {
    font-size: 2.5rem;
  }

  .temp-main {
    font-size: 3.5rem;
  }

  .weather-illustration {
    width: 110px;
    height: 110px;
  }

  .stat-item {
    flex-basis: 100%;
  }
}
</style>
