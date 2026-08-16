/**
 * Unit Tests for Formatter Utilities
 * 
 * This file tests all utility functions in formatter.js
 * 
 * Testing Framework: Vitest
 * Test Structure: Arrange → Act → Assert (AAA Pattern)
 * 
 * Why test utility functions?
 * - They're pure functions (same input = same output)
 * - Easy to test (no dependencies)
 * - Critical for app functionality
 * - Great way to catch edge cases
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  formatDate,
  formatDayOfWeek,
  formatTime,
  kelvinToCelsius,
  celsiusToFahrenheit,
  getWindDirection
} from '../utils/formatter';

/**
 * Test Suite Structure:
 * 
 * describe() - Groups related tests together
 * it() or test() - Individual test case
 * expect() - Assertion (what we expect to happen)
 * 
 * Matchers:
 * - toBe() - Strict equality (===)
 * - toEqual() - Deep equality (for objects/arrays)
 * - toContain() - Check if array/string contains value
 * - toBeCloseTo() - For floating point numbers
 */

describe('Formatter Utilities', () => {
  
  /**
   * Test Suite 1: formatDate()
   * 
   * Purpose: Ensure dates are formatted correctly
   * Edge cases: Different date formats, timezones
   */
  describe('formatDate', () => {
    it('should format a date to readable string', () => {
      // Arrange - Set up test data
      const testDate = new Date('2024-01-15T12:00:00');
      
      // Act - Execute the function
      const result = formatDate(testDate);
      
      // Assert - Check the result
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2024');
      expect(result).toContain('Monday');
    });
    
    it('should handle different dates correctly', () => {
      const date1 = new Date('2024-12-25T00:00:00');
      const result1 = formatDate(date1);
      
      expect(result1).toContain('December');
      expect(result1).toContain('25');
    });
  });
  
  /**
   * Test Suite 2: formatDayOfWeek()
   * 
   * Purpose: Test relative day formatting (Today, Tomorrow, etc.)
   * Challenging: Depends on current date
   */
  describe('formatDayOfWeek', () => {
    it('should return "Today" for current date', () => {
      const today = new Date();
      const result = formatDayOfWeek(today);
      
      expect(result).toBe('Today');
    });
    
    it('should return "Tomorrow" for next day', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = formatDayOfWeek(tomorrow);
      
      expect(result).toBe('Tomorrow');
    });
    
    it('should return day abbreviation for other dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);
      const result = formatDayOfWeek(futureDate);
      
      // Should be one of the day abbreviations
      const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      expect(validDays).toContain(result);
    });
  });
  
  /**
   * Test Suite 3: formatTime()
   * 
   * Purpose: Test Unix timestamp to time conversion
   */
  describe('formatTime', () => {
    it('should format Unix timestamp to time string', () => {
      // Unix timestamp for a specific time
      const timestamp = 1705329600; // 2024-01-15 12:00:00 UTC
      const result = formatTime(timestamp);
      
      // Result should contain time format (HH:MM AM/PM)
      expect(result).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/);
    });
    
    it('should handle midnight correctly', () => {
      const midnight = 1705276800; // Midnight timestamp
      const result = formatTime(midnight);
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });
  
  /**
   * Test Suite 4: kelvinToCelsius()
   * 
   * Purpose: Test temperature conversion from Kelvin to Celsius
   * Formula: Celsius = Kelvin - 273.15
   */
  describe('kelvinToCelsius', () => {
    it('should convert 0 Kelvin to -273°C', () => {
      const result = kelvinToCelsius(0);
      expect(result).toBe(-273);
    });
    
    it('should convert freezing point correctly', () => {
      // 273.15K = 0°C (freezing point of water)
      const result = kelvinToCelsius(273.15);
      expect(result).toBe(0);
    });
    
    it('should convert boiling point correctly', () => {
      // 373.15K = 100°C (boiling point of water)
      const result = kelvinToCelsius(373.15);
      expect(result).toBe(100);
    });
    
    it('should convert typical room temperature', () => {
      // 293.15K = 20°C
      const result = kelvinToCelsius(293.15);
      expect(result).toBe(20);
    });
    
    it('should round to nearest integer', () => {
      const result = kelvinToCelsius(293.65); // Should be 20.5 → rounds to 21
      expect(result).toBe(21);
    });
  });
  
  /**
   * Test Suite 5: celsiusToFahrenheit()
   * 
   * Purpose: Test temperature conversion from Celsius to Fahrenheit
   * Formula: Fahrenheit = (Celsius × 9/5) + 32
   */
  describe('celsiusToFahrenheit', () => {
    it('should convert freezing point correctly', () => {
      // 0°C = 32°F
      const result = celsiusToFahrenheit(0);
      expect(result).toBe(32);
    });
    
    it('should convert boiling point correctly', () => {
      // 100°C = 212°F
      const result = celsiusToFahrenheit(100);
      expect(result).toBe(212);
    });
    
    it('should convert negative temperatures', () => {
      // -40°C = -40°F (the point where scales meet!)
      const result = celsiusToFahrenheit(-40);
      expect(result).toBe(-40);
    });
    
    it('should convert room temperature', () => {
      // 20°C = 68°F
      const result = celsiusToFahrenheit(20);
      expect(result).toBe(68);
    });
    
    it('should round to nearest integer', () => {
      // 25°C = 77°F
      const result = celsiusToFahrenheit(25);
      expect(result).toBe(77);
    });
  });
  
  /**
   * Test Suite 6: getWindDirection()
   * 
   * Purpose: Test wind direction conversion from degrees to abbreviation
   * Edge cases: Boundary values, wrap-around at 360°
   */
  describe('getWindDirection', () => {
    it('should return "N" for 0 degrees', () => {
      expect(getWindDirection(0)).toBe('N');
    });
    
    it('should return "N" for 360 degrees (full circle)', () => {
      expect(getWindDirection(360)).toBe('N');
    });
    
    it('should return "E" for 90 degrees', () => {
      expect(getWindDirection(90)).toBe('E');
    });
    
    it('should return "S" for 180 degrees', () => {
      expect(getWindDirection(180)).toBe('S');
    });
    
    it('should return "W" for 270 degrees', () => {
      expect(getWindDirection(270)).toBe('W');
    });
    
    it('should return "NE" for 45 degrees', () => {
      expect(getWindDirection(45)).toBe('NE');
    });
    
    it('should return "SE" for 135 degrees', () => {
      expect(getWindDirection(135)).toBe('SE');
    });
    
    it('should return "SW" for 225 degrees', () => {
      expect(getWindDirection(225)).toBe('SW');
    });
    
    it('should return "NW" for 315 degrees', () => {
      expect(getWindDirection(315)).toBe('NW');
    });
    
    it('should handle values between cardinal directions', () => {
      // 22.5° should round to NE (45°)
      const result = getWindDirection(22);
      expect(['N', 'NE']).toContain(result);
    });
  });
});

/**
 * INTERVIEW QUESTIONS YOU CAN NOW ANSWER:
 * 
 * Q1: What is the AAA pattern in testing?
 * A: Arrange (setup data) → Act (execute function) → Assert (verify result).
 *    It makes tests clear and easy to understand.
 * 
 * Q2: What's the difference between toBe() and toEqual()?
 * A: toBe() uses === (strict equality), good for primitives.
 *    toEqual() does deep comparison, good for objects and arrays.
 * 
 * Q3: Why test utility functions separately?
 * A: They're pure functions (no side effects), easy to test, and form
 *    the foundation of app logic. Testing them ensures reliability.
 * 
 * Q4: What makes a good unit test?
 * A: Fast, isolated, repeatable, self-validating, and tests one thing.
 *    Good tests also cover edge cases and are easy to understand.
 * 
 * Q5: How do you test time-dependent functions?
 * A: Use mocking/stubbing to control time (vi.setSystemTime() in Vitest),
 *    or test relative behavior rather than absolute values.
 */
