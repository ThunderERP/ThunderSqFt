/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E3A5F",
        },
        accent: {
          DEFAULT: "#E8480C",
        },
        success: {
          DEFAULT: "#2A7F62",
        },
      },
    },
  },
  plugins: [],
};
