// tailwind.config.js
import defaultTheme from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import containerQ from "@tailwindcss/container-queries";
// @ts-expect-error: tailwindcss-ripple is not typed
import ripple from "tailwindcss-ripple";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: ["./**/*.{ts,tsx,js,jsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          background: "var(--brand-background)",
          surface: "var(--brand-surface)",
          accent: "var(--brand-accent)",
          tertiary: "var(--brand-tertiary)",
          vsdark: "var(--brand-vsdarker)",
          vsdarker: "var(--brand-vsdarker)",

          text: {
            default: "var(--text-brand)",
            secondary: "var(--text-brand-secondary)",
            muted: "var(--text-muted)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
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
  plugins: [typography, containerQ, ripple(), animate],
} satisfies Config;
