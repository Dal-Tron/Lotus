/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        "header-height": "var(--header-height)",
        "footer-height": "var(--footer-height)",
        "main-height":
          "calc(100vh - var(--header-height) - var(--footer-height))",
      },
      width: {
        "sidebar-width": "var(--sidebar-width)",
      },
    },
  },
  plugins: [],
};
