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
      colors: {
        "cus-gray-light": "var(--cus-gray-light)",
        "cus-gray-medium": "var(--cus-gray-medium)",
        "cus-gray-dark": "var(--cus-gray-dark)",
        "cus-black": "var(--cus-black)",
        "cus-brown": "var(--cus-brown)",
        "cus-blackest": "var(--cus-blackest)",
        "cus-green": "var(--cus-green)",
        "cus-orange": "var(--cus-orange)",
        "cus-pink": "var(--cus-pink)",
      },
    },
  },
  plugins: [],
};
