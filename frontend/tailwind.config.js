/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        /* =================================================
           Semantic Design Tokens
           ================================================= */

        app: "var(--color-app)",

        surface: "var(--color-surface)",

        "surface-muted": "var(--color-surface-muted)",

        "primary-text": "var(--color-primary-text)",

        secondary: "var(--color-secondary)",

        "border-default": "var(--color-border-default)",

        "border-strong": "var(--color-border-strong)",

        primary: "var(--color-primary)",

        "primary-hover": "var(--color-primary-hover)",

        success: "var(--color-success)",

        warning: "var(--color-warning)",

        danger: "var(--color-danger)",

        /* =================================================
           Existing Personalised Student App Palette
           ================================================= */

        ink: {
          950: "#0B1220",
          900: "#111A2E",
          800: "#182541",
          700: "#223257",
        },

        amber: {
          400: "#F5B85B",
          500: "#EDA23A",
          600: "#D68520",
        },

        mist: {
          50: "#F7F8FB",
          100: "#EEF1F7",
          200: "#DFE4EE",
        },
      },

      fontFamily: {
        display: [
          "'Fraunces'",
          "Georgia",
          "serif",
        ],

        body: [
          "'Inter'",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
      },

      boxShadow: {
        soft: "0 8px 30px -12px rgba(11, 18, 32, 0.25)",
      },

      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },

  plugins: [],
};