// tailwind.config.js

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,js,jsx,md,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        brand: {
          background: "var(--background)",
          surface: "var(--surface)",
          border: "var(--border)",
          accent: "var(--accent)",
          main: "var(--main)",
          accentDark: "var(--accent-dark)",
          glow: "var(--glow)",
          faint: "var(--faint)",
          a100: "var(--accent-100)",
          a200: "var(--accent-200)",
          a300: "var(--accent-300)",
          a400: "var(--accent-400)",
          a500: "var(--accent-500)",
          c100: "var(--compliment-100)",
          c200: "var(--compliment-200)",
          alt100: "var(--alt-100)",
          alt200: "var(--alt-200)",
          alt300: "var(--alt-300)",

          text: {
            base: "var(--text)",
            muted: "var(--text-muted)",
          },
        },
      },
      backgroundImage: {
        "gradient-gold":
          "linear-gradient(135deg, var(--accent), var(--accent-dark))",
        "gradient-glow": "linear-gradient(145deg, var(--glow), var(--faint))",
        "gradient-surface":
          "linear-gradient(to bottom, var(--surface), var(--background))",
        "gradient-brand":
          "linear-gradient(90deg, var(--accent-dark), var(--accent), var(--glow))",
        "gradient-ui":
          "linear-gradient(to right, var(--background), var(--surface))",
        "gradient-ui-dark":
          "linear-gradient(to right, var(--surface), var(--background))",
        "radial-prime":
          "radial-gradient(ellipse at 50% 75%, var(--main) 5%, var(--accent-dark) 45%, var(--glow) 90%)",
      },
    },
  },
  plugins: [],
};
