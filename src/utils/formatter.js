/**
 * Format a date to a readable string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format timestamp to day of week
 * @param {Date} date - Date object
 * @returns {string} Day of week
 */
export const formatDayOfWeek = (date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
};

/**
 * Format time from timestamp
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted time
 */
export const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Convert temperature from Kelvin to Celsius
 * @param {number} kelvin - Temperature in Kelvin
 * @returns {number} Temperature in Celsius
 */
export const kelvinToCelsius = (kelvin) => {
  return Math.round(kelvin - 273.15);
};

/**
 * Convert temperature from Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => {
  return Math.round((celsius * 9/5) + 32);
};

/**
 * Get wind direction from degrees
 * @param {number} degrees - Wind direction in degrees
 * @returns {string} Wind direction abbreviation
 */
export const getWindDirection = (degrees) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};
