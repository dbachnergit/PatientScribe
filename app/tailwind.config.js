/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D3A6E',
          light: '#3D4A7E',
        },
        accent: {
          DEFAULT: '#5B7FE1',
          light: '#7B9FFF',
        },
        recording: '#F56565',
        success: '#4FD1C5',
        warning: '#F6AD55',
        background: '#FAF9F7',
        card: '#FFFFFF',
        border: '#D5D3CF',
        input: '#E5E4E2',
        muted: '#6B6966',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
