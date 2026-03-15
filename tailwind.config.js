// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ui-teal': '#00bcd4',
        'ui-teal-light': '#4dd0e1',
        'ui-teal-dark': '#0097a7',
        'seed-bg': '#f0f4c3',
        'seed-border': '#dce775',
        'text-dark': '#37474f',
        'platform-base': '#78909c',
        'platform-panel': '#e0e0e0',
        'bottom-bar-bg': '#455a64',
        'correct-green': '#66bb6a',
        'incorrect-red': '#ef5350',
        'dark-bg': '#212121', // Added for body background
        'word-display-bg': '#455a64',
        'word-blank-border': '#78909c',
        'word-blank-bg': '#37474f',
        'progress-bg': '#263238',
        'progress-bar-border': '#37474f',
        'bottom-bar-border': '#37474f',
        'icon-btn-border': '#78909c',
        'platform-border-light': '#90a4ae',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}