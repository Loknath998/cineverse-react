/** @type {import('tailwindcss').Config} */
const color = (name) => `oklch(var(${name}) / <alpha-value>)`;

module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        background: color("--background"),
        foreground: color("--foreground"),
        card: { DEFAULT: color("--card"), foreground: color("--card-foreground") },
        popover: { DEFAULT: color("--popover"), foreground: color("--popover-foreground") },
        primary: { DEFAULT: color("--primary"), foreground: color("--primary-foreground") },
        secondary: { DEFAULT: color("--secondary"), foreground: color("--secondary-foreground") },
        muted: { DEFAULT: color("--muted"), foreground: color("--muted-foreground") },
        accent: { DEFAULT: color("--accent"), foreground: color("--accent-foreground") },
        destructive: {
          DEFAULT: color("--destructive"),
          foreground: color("--destructive-foreground"),
        },
        border: color("--border"),
        input: color("--input"),
        ring: color("--ring"),
        gold: { DEFAULT: color("--gold"), soft: color("--gold-soft") },
        surface: { DEFAULT: color("--surface"), 2: color("--surface-2") },
        chart: {
          1: color("--chart-1"),
          2: color("--chart-2"),
          3: color("--chart-3"),
          4: color("--chart-4"),
          5: color("--chart-5"),
        },
        sidebar: {
          DEFAULT: color("--sidebar"),
          foreground: color("--sidebar-foreground"),
          primary: color("--sidebar-primary"),
          "primary-foreground": color("--sidebar-primary-foreground"),
          accent: color("--sidebar-accent"),
          "accent-foreground": color("--sidebar-accent-foreground"),
          border: color("--sidebar-border"),
          ring: color("--sidebar-ring"),
        },
      },
      ringOffsetColor: { background: color("--background") },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        sans: ["Archivo", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 12px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": { "0%,70%,100%": { opacity: "1" }, "20%,50%": { opacity: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      addUtilities({
        ".label-mono": {
          fontFamily: 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)',
          fontSize: "0.625rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "oklch(var(--muted-foreground))",
        },
        ".label-gold": {
          fontFamily: 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)',
          fontSize: "0.625rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "oklch(var(--gold-soft))",
        },
        ".section-title": {
          fontFamily: 'var(--font-display, "Playfair Display", Georgia, serif)',
          fontSize: "1.5rem",
          lineHeight: "1.2",
          color: "oklch(var(--foreground))",
        },
        ".hide-scrollbar": {
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
        ".film-grain": {
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: "0",
            pointerEvents: "none",
            zIndex: "-1",
            backgroundImage:
              "radial-gradient(circle at 50% 50%, transparent 0%, color-mix(in oklab, oklch(var(--background)) 65%, transparent) 100%)",
          },
        },
      });
    },
  ],
};
