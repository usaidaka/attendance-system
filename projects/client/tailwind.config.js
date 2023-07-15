/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-button": "#4169E1",
        "blue-absent-history": "#8DA5ED",
        "pink-footer": "#F61E61",
        "green-absent-out": "#27D427",
        "green-payroll": "#58AF84",
      },
    },
  },
  plugins: [],
};
