// tailwind.config.js
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      // "sm": "640px",
      // "md": "768px",
      // "lg": "1024px",
      // "xl": "1440px",
      // "four": "2560px",

      // Define your custom breakpoint here

      "sm": "640px",
      "md": "768px",
      "lg": "1024px",

      "0xl": "1280px",

      "xl": "1440px",
      "2xl": "1536px",
      "3xl": "1920px",
      "four": "2560px",
    },
    extend: {
      fontFamily: {
        "sans": ["Arial", "sans-serif"],
        "serif": ["Century Gothic", "serif"],
        "poppins": ["Poppins", "sans-serif"],
        "montserrat": ["Montserrat", "sans-serif"],
        "Inter": ["Inter", "sans-serif"],
      },
      colors: {
        "wd-blue": "#50A3D8",
        "wd-blue-2": "#A0D0EF",
      },
      // specific heights and widths
      width: {
        "600w": "600px",
        "800w": "800px",
        "1000w": "1000px",
        "1250w": "1250px",
        "1500w": "1500px",
        "1750w": "1500px",
        "2000w": "2000px",
        "3000w": "3000px",
      },
      height: {
        "600h": "600px",
        "800h": "800px",
        "1000h": "1000px",
        "1250h": "1250px",
        "1500h": "1500px",
        "1750h": "1500px",
        "2000h": "2000px",
        "3000h": "3000px",
      },
    },
  },
  variants: {},
  plugins: [],
};
