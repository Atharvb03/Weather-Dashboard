<!--
  SearchBar Component
  
  Purpose: Allow users to search for weather by city name
  
  Features:
  - Text input field
  - Search button
  - Submit on Enter key press
  - Emits 'search' event to parent component
  
  Props: None
  Emits: 'search' event with city name
-->

<template>
  <div class="search-container">
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search city..."
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <button 
        @click="handleSearch" 
        class="search-button"
        :disabled="!searchQuery.trim()"
      >
        Search
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');
const emit = defineEmits(['search']);

const handleSearch = () => {
  const city = searchQuery.value.trim();
  
  if (!city) {
    return;
  }
  
  emit('search', city);
};
</script>

<style scoped>
.search-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 0.35rem 0.5rem 0.35rem 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-width: 450px;
  width: 100%;
}

.search-box:focus-within {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}

.search-icon {
  font-size: 1.05rem;
  opacity: 0.65;
}

.search-input {
  flex: 1;
  padding: 0.55rem 0.4rem;
  font-size: 0.875rem;
  background: transparent;
  border: none;
  outline: none;
  color: inherit;
  font-family: inherit;
}

.search-input::placeholder {
  color: currentColor;
  opacity: 0.5;
}

.search-button {
  padding: 0.5rem 1.25rem;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 9px;
  color: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  white-space: nowrap;
}

.search-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
}

.search-button:active:not(:disabled) {
  transform: translateY(0);
}

.search-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .search-box {
    max-width: 100%;
  }
}
</style>
