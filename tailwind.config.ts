import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Use class-based dark mode instead of media query
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        'bg-alt': 'rgb(var(--color-bg-alt) / <alpha-value>)',
        default: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-hover': 'rgb(var(--color-accent-hover) / <alpha-value>)',
        'accent-text': 'rgb(var(--color-accent-text) / <alpha-value>)',
        'tag-form': 'rgb(var(--color-tag-form-bg-rgb) / <alpha-value>)',
        'tag-form-text': 'rgb(var(--color-tag-form-text-rgb) / <alpha-value>)',
        'tag-meter': 'rgb(var(--color-tag-meter-bg-rgb) / <alpha-value>)',
        'tag-meter-text': 'rgb(var(--color-tag-meter-text-rgb) / <alpha-value>)',
        'tag-device': 'rgb(var(--color-tag-device-bg-rgb) / <alpha-value>)',
        'tag-device-text': 'rgb(var(--color-tag-device-text-rgb) / <alpha-value>)',
      },
      ringColor: {
        default: 'rgb(var(--color-border) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
      },
      ringOffsetColor: {
        'bg-alt': 'rgb(var(--color-bg-alt) / <alpha-value>)',
      },
    },
  },
};

export default config;
