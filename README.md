# 🌤️ Weather Dashboard

A modern, responsive weather application built with **Vue 3**, **Vite**, **Pinia**, and **Axios**. Get real-time weather information and 6-day forecasts for any city worldwide.

![Vue 3](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=flat&logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-4.0-FFD859?style=flat&logo=vue.js&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.18-5A29E4?style=flat&logo=axios&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4.1-6E9F18?style=flat&logo=vitest&logoColor=white)

---

## ✨ Features

- 🔍 **City Search** - Search weather by city name with auto-validation
- 🌡️ **Current Weather** - Real-time temperature, humidity, wind speed, pressure, and visibility
- 📅 **6-Day Forecast** - Extended forecast with min/max temperatures and conditions
- 🔄 **Refresh Data** - Update weather information without page reload
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful gradient cards with smooth hover effects
- ⚡ **Fast Performance** - Built with Vite for lightning-fast HMR
- 🧪 **Well Tested** - Comprehensive unit and component tests

---

## 🚀 Tech Stack

### Core Technologies
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[Vite](https://vitejs.dev/)** - Next-generation frontend build tool
- **[Pinia](https://pinia.vuejs.org/)** - Official state management for Vue
- **[Axios](https://axios-http.com/)** - Promise-based HTTP client

### Testing
- **[Vitest](https://vitest.dev/)** - Vite-native testing framework
- **[Vue Test Utils](https://test-utils.vuejs.org/)** - Official testing utilities for Vue

### API
- **[OpenWeatherMap API](https://openweathermap.org/api)** - Weather data provider

---

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (v7 or higher) - Comes with Node.js

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Get OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a **free account**
3. Navigate to **"My API keys"** section
4. Copy your API key

⚠️ **Note:** New API keys take 10-15 minutes to activate.

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your API key:

```env
VITE_WEATHER_API_KEY=your_actual_api_key_here
```

**Important:** 
- Don't add quotes around the API key
- Don't commit the `.env` file to Git (it's in `.gitignore`)

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

---

## 📁 Project Structure

```
weather-dashboard/
├── public/                 # Static assets
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/        # Vue components
│   │   ├── SearchBar.vue       # City search input
│   │   ├── CurrentWeather.vue  # Current weather display
│   │   └── Forecast.vue        # 6-day forecast cards
│   ├── services/          # API layer
│   │   └── weatherApi.js       # Axios API calls
│   ├── stores/            # Pinia stores
│   │   └── weatherStore.js     # Weather state management
│   ├── utils/             # Helper functions
│   │   └── formatter.js        # Date/temp formatters
│   ├── tests/             # Test files
│   │   ├── formatter.test.js   # Utility tests
│   │   └── SearchBar.test.js   # Component tests
│   ├── App.vue            # Root component
│   ├── main.js            # App entry point
│   └── style.css          # Global styles
├── .env                   # Environment variables (create this)
├── .env.example           # Environment template
├── index.html            # HTML entry point
├── package.json          # Dependencies & scripts
├── vite.config.js        # Vite configuration
└── vitest.config.js      # Vitest configuration
```

---

## 🏗️ Architecture & Design Patterns

### State Management (Pinia)

```javascript
// stores/weatherStore.js
export const useWeatherStore = defineStore('weather', {
  state: () => ({
    city: null,
    weather: null,
    forecast: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchWeatherData(cityName) {
      // Fetch weather data from API
    }
  }
});
```

### API Service Layer

```javascript
// services/weatherApi.js
const weatherApiClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10000
});
```

### Component Architecture

```
App.vue (Container)
  ├── SearchBar (User Input)
  ├── CurrentWeather (Display)
  └── Forecast (Display)
```

**Data Flow:**
```
User types city → SearchBar emits event → App.vue calls Pinia action
→ Pinia fetches from API → State updates → Components re-render
```

---

## 🧪 Testing

The project includes comprehensive tests:

```bash
# Run all tests
npm test
```

### Test Coverage

- **Unit Tests** (`formatter.test.js`) - 27 tests
  - Date formatting
  - Temperature conversions
  - Wind direction calculation
  
- **Component Tests** (`SearchBar.test.js`) - 17 tests
  - Rendering
  - User interactions
  - Event emissions

**Total: 44 tests** ✅

---

## 🌐 API Integration

### OpenWeatherMap API

The app uses two endpoints:

1. **Current Weather**: `GET /weather?q={city}`
2. **5-Day Forecast**: `GET /forecast?q={city}`

### Error Handling

- ✅ Invalid city names (404)
- ✅ Invalid API keys (401)
- ✅ Network timeouts
- ✅ Server errors (5xx)

---

## 🎨 UI/UX Features

### Responsive Design

- **Desktop (>1400px)**: Full layout with 3 forecast cards per row
- **Tablet (768-1400px)**: 2-column forecast layout
- **Mobile (<768px)**: Single column stacked layout

### Design Highlights

- 🎨 Modern gradient backgrounds
- ✨ Smooth hover animations
- 📱 Touch-friendly interface
- 🌈 Color-coded weather conditions

---

## 🐛 Troubleshooting

### API Key Issues

**Problem**: Getting 401 "Invalid API key" error

**Solutions**:
1. Wait 10-15 minutes for new keys to activate
2. Check for typos in `.env` file
3. Restart dev server after changing `.env`

### Installation Issues

**Problem**: `npm install` fails

**Solutions**:
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgments

- **OpenWeatherMap** for providing the weather API
- **Vue.js Team** for the amazing framework
- **Vite Team** for the blazing-fast build tool

---

## 🎓 What You'll Learn

This project demonstrates:

- ✅ Vue 3 Composition API (`<script setup>`)
- ✅ Pinia state management
- ✅ Axios HTTP requests with interceptors
- ✅ Component architecture (props & events)
- ✅ Computed properties & reactivity
- ✅ Vitest unit & component testing
- ✅ Responsive CSS Grid & Flexbox
- ✅ API integration & error handling
- ✅ Environment variables
- ✅ Modern ES6+ JavaScript

Perfect for learning modern Vue development! 🚀

---

Made with ❤️ using Vue 3 + Vite
