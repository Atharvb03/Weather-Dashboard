<template>
  <!-- Forecast Strip - Subtle Glass -->
  <div class="forecast-strip">
    <div 
      v-for="(day, index) in forecastData.slice(0, 5)" 
      :key="day.dt"
      class="forecast-column"
    >
      <div class="day-name">{{ formatDayName(day.dt, index) }}</div>
      <img 
        :src="getWeatherIcon(day.weather[0].icon)"
        :alt="day.weather[0].description"
        class="day-icon"
      />
      <div class="temp-max">{{ Math.round(day.main.temp_max) }}°C</div>
      <div class="temp-min">{{ Math.round(day.main.temp_min) }}°C</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  forecastData: {
    type: Array,
    required: true,
    validator: (value) => {
      return Array.isArray(value) && value.length > 0;
    }
  }
});

const formatDayName = (timestamp, index) => {
  if (index === 0) return 'TODAY';
  if (index === 1) return 'TOMORROW';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
};

const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};
</script>

<style scoped>
/* Forecast Strip - Subtle Glass */
.forecast-strip {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  color: inherit;
}

.forecast-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.4rem;
  position: relative;
}

.forecast-column:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 70%;
  background: rgba(255, 255, 255, 0.15);
}

.day-name {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  opacity: 0.75;
  text-transform: uppercase;
  color: inherit;
}

.day-icon {
  width: 54px;
  height: 54px;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.12));
  margin: 0.2rem 0;
}

.temp-max {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: inherit;
}

.temp-min {
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.65;
  letter-spacing: -0.01em;
  color: inherit;
}

/* Responsive Design */
@media (max-width: 768px) {
  .forecast-strip {
    grid-template-columns: repeat(3, 1fr);
    padding: 1rem;
  }

  .forecast-column:nth-child(n+4) {
    display: none;
  }

  .forecast-column:nth-child(3)::after {
    display: none;
  }

  .day-icon {
    width: 50px;
    height: 50px;
  }

  .temp-max {
    font-size: 1.1rem;
  }

  .temp-min {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .forecast-strip {
    grid-template-columns: repeat(2, 1fr);
  }

  .forecast-column:nth-child(n+3) {
    display: none;
  }

  .forecast-column:nth-child(2)::after {
    display: none;
  }
}
</style>
