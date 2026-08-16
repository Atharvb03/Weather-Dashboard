/**
 * Main Entry Point
 * 
 * This file initializes the Vue application.
 * It's the starting point of our app.
 * 
 * Flow:
 * 1. Import Vue's createApp function
 * 2. Import Pinia's createPinia function
 * 3. Import root component (App.vue)
 * 4. Create Vue app instance
 * 5. Install Pinia plugin
 * 6. Mount app to DOM
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';

/**
 * Create the Vue application instance
 * 
 * createApp(App) creates a new Vue app with App.vue as the root component
 */
const app = createApp(App);

/**
 * Create and install Pinia
 * 
 * createPinia() creates a Pinia instance (the store manager)
 * app.use() installs it as a plugin
 * 
 * After this line, all components can use:
 * - useWeatherStore()
 * - Any other store we create
 */
const pinia = createPinia();
app.use(pinia);

/**
 * Mount the app to the DOM
 * 
 * app.mount('#app') tells Vue:
 * "Find the HTML element with id='app' and render the Vue app inside it"
 * 
 * This element is in index.html: <div id="app"></div>
 */
app.mount('#app');

/**
 * INTERVIEW QUESTION:
 * Q: Why do we use app.use(pinia) before app.mount('#app')?
 * A: Plugins must be installed before mounting. If we mount first,
 *    components won't have access to the store, causing errors.
 * 
 * Correct order:
 * 1. createApp()
 * 2. app.use() - install plugins
 * 3. app.mount() - render to DOM
 */
