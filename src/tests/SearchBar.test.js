/**
 * Component Tests for SearchBar
 * 
 * This file tests the SearchBar Vue component
 * 
 * Testing Framework: Vitest + Vue Test Utils
 * 
 * Why test components?
 * - Ensure UI renders correctly
 * - Verify user interactions work
 * - Catch regressions when updating code
 * - Document component behavior
 * 
 * Vue Test Utils provides:
 * - mount() - Render component
 * - wrapper.find() - Query elements
 * - wrapper.trigger() - Simulate events
 * - wrapper.emitted() - Check emitted events
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SearchBar from '../components/SearchBar.vue';

/**
 * Component Testing Strategy:
 * 
 * 1. Rendering Tests - Does it show correctly?
 * 2. User Interaction Tests - Do clicks/typing work?
 * 3. Event Emission Tests - Does it communicate with parent?
 * 4. Edge Case Tests - What happens with invalid input?
 */

describe('SearchBar Component', () => {
  
  /**
   * Test Suite 1: Component Rendering
   * 
   * Purpose: Verify component renders all elements correctly
   */
  describe('Component Rendering', () => {
    it('should render input field', () => {
      // Arrange & Act
      const wrapper = mount(SearchBar);
      
      // Assert
      const input = wrapper.find('input[type="text"]');
      expect(input.exists()).toBe(true);
    });
    
    it('should render search button', () => {
      const wrapper = mount(SearchBar);
      
      const button = wrapper.find('button');
      expect(button.exists()).toBe(true);
      expect(button.text()).toContain('Search');
    });
    
    it('should have correct placeholder text', () => {
      const wrapper = mount(SearchBar);
      
      const input = wrapper.find('input');
      expect(input.attributes('placeholder')).toContain('city');
    });
    
    it('should show helpful hints', () => {
      const wrapper = mount(SearchBar);
      
      const hint = wrapper.find('.search-hint');
      expect(hint.exists()).toBe(true);
      expect(hint.text()).toContain('Try:');
    });
  });
  
  /**
   * Test Suite 2: User Input Handling
   * 
   * Purpose: Test v-model binding and input validation
   */
  describe('User Input Handling', () => {
    it('should update input value when user types', async () => {
      // Arrange
      const wrapper = mount(SearchBar);
      const input = wrapper.find('input');
      
      // Act - Simulate user typing
      await input.setValue('London');
      
      // Assert
      expect(input.element.value).toBe('London');
    });
    
    it('should have button disabled when input is empty', async () => {
      const wrapper = mount(SearchBar);
      const button = wrapper.find('button');
      
      // Initially, input is empty
      expect(button.attributes('disabled')).toBeDefined();
    });
    
    it('should enable button when input has text', async () => {
      const wrapper = mount(SearchBar);
      const input = wrapper.find('input');
      const button = wrapper.find('button');
      
      // Type some text
      await input.setValue('Paris');
      
      // Button should be enabled now
      expect(button.attributes('disabled')).toBeUndefined();
    });
    
    it('should keep button disabled for whitespace-only input', async () => {
      const wrapper = mount(SearchBar);
      const input = wrapper.find('input');
      const button = wrapper.find('button');
      
      // Type only spaces
      await input.setValue('   ');
      
      // Button should still be disabled
      expect(button.attributes('disabled')).toBeDefined();
    });
  });
  
  /**
   * Test Suite 3: Event Emission
   * 
   * Purpose: Test communication with parent component
   * SearchBar emits 'search' event with city name
   */
  describe('Event Emission', () => {
    it('should emit search event when button is clicked', async () => {
      // Arrange
      const wrapper = mount(SearchBar);
      const input = wrapper.find('input');
      const button = wrapper.find('button');
      
      // Act
      await input.setValue('Tokyo');
      await button.trigger('click');
      
      // Assert - Check if 'search' event was emitted
      expect(wrapper.emitted()).toHaveProperty('search');
      
      // Check the emitted value
      const searchEvents = wrapper.emitted('search');
      expect(searchEvents).toHaveLength(1);
      expect(searchEvents[0]).toEqual(['Tokyo']);
    });
    
    it('should emit search event when Enter key is pressed', async () => {
      // Arrange
      const wrapper = mount(SearchBar);
      const input = wrapper.find('input');
      
      // Act
      await input.setValue('New York');
      await input.trigger('keyup.enter');
      
      // Assert
      expect(wrapper.emitted()).toHaveProperty('search');
      expect(wrapper.emitted('search')[0]).toEqual(['New York']);
    });
    
    it('should trim whitespace from city name', async () => {
      const wrapper = mount(SearchBar);
      const input = wrapper.find('input');
      const button = wrapper.find('button');
      
      // Type with leading/trailing spaces
      await input.setValue('  Mumbai  ');
      await button.trigger('click');
      
      // Should emit trimmed value
      expect(wrapper.emitted('search')[0]).toEqual(['Mumbai']);
    });
    
    it('should not emit event when input is empty', async () => {
      const wrapper = mount(SearchBar);
      const button = wrapper.find('button');
      
      // Try to click with empty input (button is disabled, but test the logic)
      await button.trigger('click');
      
      // Should not emit search event
      expect(wrapper.emitted('search')).toBeUndefined();
    });
  });
  
  /**
   * Test Suite 4: Multiple Searches
   * 
   * Purpose: Test that component can handle multiple searches
   */
  describe('Multiple Searches', () => {
    it('should handle multiple consecutive searches', async () => {
      const wrapper = mount(SearchBar);
      const input = wrapper.find('input');
      const button = wrapper.find('button');
      
      // First search
      await input.setValue('Berlin');
      await button.trigger('click');
      
      // Second search
      await input.setValue('Paris');
      await button.trigger('click');
      
      // Third search
      await input.setValue('Rome');
      await button.trigger('click');
      
      // Should have emitted 3 times
      expect(wrapper.emitted('search')).toHaveLength(3);
      expect(wrapper.emitted('search')[0]).toEqual(['Berlin']);
      expect(wrapper.emitted('search')[1]).toEqual(['Paris']);
      expect(wrapper.emitted('search')[2]).toEqual(['Rome']);
    });
    
    it('should keep input value after search', async () => {
      const wrapper = mount(SearchBar);
      const input = wrapper.find('input');
      const button = wrapper.find('button');
      
      await input.setValue('Sydney');
      await button.trigger('click');
      
      // Input should still contain the value
      expect(input.element.value).toBe('Sydney');
    });
  });
  
  /**
   * Test Suite 5: Edge Cases
   * 
   * Purpose: Test unusual or unexpected inputs
   */
  describe('Edge Cases', () => {
    it('should handle special characters', async () => {
      const wrapper = mount(SearchBar);
      const input = wrapper.find('input');
      const button = wrapper.find('button');
      
      // City name with special characters
      await input.setValue('São Paulo');
      await button.trigger('click');
      
      expect(wrapper.emitted('search')[0]).toEqual(['São Paulo']);
    });
    
    it('should handle multi-word city names', async () => {
      const wrapper = mount(SearchBar);
      const input = wrapper.find('input');
      const button = wrapper.find('button');
      
      await input.setValue('New York City');
      await button.trigger('click');
      
      expect(wrapper.emitted('search')[0]).toEqual(['New York City']);
    });
    
    it('should handle very long city names', async () => {
      const wrapper = mount(SearchBar);
      const input = wrapper.find('input');
      const button = wrapper.find('button');
      
      const longName = 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch';
      await input.setValue(longName);
      await button.trigger('click');
      
      expect(wrapper.emitted('search')[0]).toEqual([longName]);
    });
  });
});

/**
 * INTERVIEW QUESTIONS YOU CAN NOW ANSWER:
 * 
 * Q1: How do you test Vue components?
 * A: Use Vue Test Utils to mount components, query elements with find(),
 *    simulate user interactions with trigger(), and verify results with assertions.
 * 
 * Q2: What is mount() vs shallowMount()?
 * A: mount() renders the component and all child components (full rendering).
 *    shallowMount() only renders the component, stubs children (faster, more isolated).
 * 
 * Q3: How do you test event emissions in Vue?
 * A: Use wrapper.emitted() to get emitted events. It returns an object with
 *    event names as keys and arrays of emitted values.
 * 
 * Q4: How do you simulate user input in tests?
 * A: Use setValue() for inputs, trigger() for events (click, keyup, etc.).
 *    Always await async operations!
 * 
 * Q5: What makes a good component test?
 * A: Tests user-facing behavior (not implementation details), is maintainable,
 *    fast, and covers happy paths plus edge cases.
 */
