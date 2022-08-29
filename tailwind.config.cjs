const defaultTheme = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      gridTemplateRows: {
        '7': 'repeat(7, minmax(0, 1fr))',
      }
    },
  },
  daisyui: {
    themes: [
      {
        treelar: {
          "primary": "#3399ff",
          "secondary": "#e4007f",
          "accent": "#e6d617",
          "neutral": "#3D4451",
          "base-100": "#3D4451",
          "info": "#49B9F9",
          "success": "#13E8AE",
          "warning": "#F0A20B",
          "error": "#f23b4c"
        }
      }
    ]
  },
  plugins: [require("daisyui")],
};
