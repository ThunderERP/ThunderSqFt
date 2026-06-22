/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic Blueprint colors defined via CSS variables
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        gridLine: 'var(--grid-line)',
        'blueprint-accent': 'var(--blueprint-accent)',
        // Retain primary/accent just for backward compatibility during refactor, but map them to blueprint shades
        primary: { 50:'#F0F4F8',100:'#D9E2EC',200:'#BCCCDC',300:'#9FB3C8',400:'#829AB1',500:'#627D98',600:'#486581',700:'#334E68',800:'#243B53',900:'#102A43' },
        accent:  { 50:'#EFF6FF',100:'#DBEAFE',200:'#BFDBFE',300:'#93C5FD',400:'#60A5FA',500:'#3B82F6',600:'#2563EB',700:'#1D4ED8' },
      },
      fontFamily: {
        sans: ['Public Sans', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        // Blueprint style removes soft shadows, replacing with sharp borders or flat aesthetics
        xs: 'none',
        card: 'none',
        elevated: 'none',
        floating: 'none',
        primary: 'none',
      }
    },
  },
  plugins: [],
}
