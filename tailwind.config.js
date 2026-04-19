/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0d9488",
        secondary: "#134e4a",
        surface: "#f0fdfa",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(17, 24, 39, 0.12)",
        lift: "0 20px 50px rgba(15, 23, 42, 0.25)",
      },
      borderRadius: {
        "2xl": "1rem",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
