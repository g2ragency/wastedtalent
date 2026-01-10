/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: '#161f48',
        white: '#ffffff',
        gold: '#d6b35f',
        lightlightgrey: '#F2F2F2',
        grey: '#6e6b60',
        lightgrey: '#dcdee1',
      },
      fontFamily: {
        'sans': ['Heebo', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        '1360': '1360px',
      },
    },
  },
  plugins: [],
}
