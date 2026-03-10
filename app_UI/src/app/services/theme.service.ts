import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly DARK_MODE_KEY = 'darkMode';
  
  // Signal to track dark mode state
  private darkModeSignal = signal<boolean>(this.isDarkMode());
  
  // Public readonly signal for components to consume
  readonly darkMode = this.darkModeSignal.asReadonly();

  constructor() {
    // Apply dark mode on service initialization
    this.applyDarkMode(this.isDarkMode());
  }

  /**
   * Check if dark mode is currently enabled
   */
  isDarkMode(): boolean {
    const saved = localStorage.getItem(this.DARK_MODE_KEY);
    if (saved !== null) {
      return saved === 'true';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Set dark mode state
   * @param isDark - Whether to enable dark mode
   */
  setDarkMode(isDark: boolean): void {
    localStorage.setItem(this.DARK_MODE_KEY, isDark.toString());
    this.darkModeSignal.set(isDark);
    this.applyDarkMode(isDark);
  }

  /**
   * Toggle dark mode
   * @returns The new dark mode state
   */
  toggleDarkMode(): boolean {
    const newMode = !this.darkModeSignal();
    this.setDarkMode(newMode);
    return newMode;
  }

  /**
   * Apply dark mode to the document
   * @param isDark - Whether to enable dark mode
   */
  private applyDarkMode(isDark: boolean): void {
    const html = document.documentElement;
    console.log('Applying dark mode:', isDark, 'to element:', html);
    if (isDark) {
      html.classList.add('dark-theme');
      html.setAttribute('data-theme', 'dark');
      console.log('Dark theme class added, current classes:', html.classList);
    } else {
      html.classList.remove('dark-theme');
      html.removeAttribute('data-theme');
      console.log('Dark theme class removed, current classes:', html.classList);
    }
  }
}
