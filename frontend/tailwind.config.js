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
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-muted': 'var(--ink-muted)',
        gridLine: 'var(--grid-line)',
        'bg-body': 'var(--bg-body)',
        'bg-card': 'var(--bg-card)',
        'bg-surface': 'var(--bg-surface)',
        'bg-hover': 'var(--bg-hover)',
        'border-color': 'var(--border-color)',
        'border-hover': 'var(--border-hover)',
        'accent-soft': 'var(--accent-soft)',
        'gold-soft': 'var(--gold-soft)',
        'violet-soft': 'var(--violet-soft)',
        'purple-soft': 'var(--purple-soft)',
        'success-soft': 'var(--success-soft)',
        'warning-soft': 'var(--warning-soft)',
        'danger-soft': 'var(--danger-soft)',
        whatsapp: 'var(--whatsapp)',
        zapier: 'var(--zapier)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        gold: 'var(--gold)',
        violet: 'var(--violet)',
        purple: 'var(--purple)',
        success: 'var(--success)',
        primary: { 50:'#F0F4F8',100:'#D9E2EC',200:'#BCCCDC',300:'#9FB3C8',400:'#829AB1',500:'#627D98',600:'#486581',700:'#334E68',800:'#243B53',900:'#102A43' },
        accent:  { DEFAULT: 'var(--accent)', 50:'#EFF6FF',100:'#DBEAFE',200:'#BFDBFE',300:'#93C5FD',400:'#60A5FA',500:'#3B82F6',600:'#2563EB',700:'#1D4ED8' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.3)',
        hover: '0 8px 24px -8px rgba(0,0,0,0.5)',
        glow: '0 0 20px rgba(61,127,255,0.25)',
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
