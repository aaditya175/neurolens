import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        
        // NeuroLens Clinical Palette
        clinical: {
          bg: "#0B0F19",
          surface: "#111827",
          panel: "#1F2937",
          border: "#374151",
          highlight: "#3B82F6",
        },
        // Tumour Sub-Regions (Consistent Everywhere)
        tumour: {
          ncr: "#EF4444", // Red: Necrotic / Non-enhancing core
          ed: "#EAB308",  // Yellow-Green: Peritumoural edema
          et: "#06B6D4",  // Cyan-Blue: Enhancing tumour
          wt: "#8B5CF6",  // Purple: Whole tumour composite
          tc: "#F97316",  // Orange: Tumour core composite
        },
      },
    },
  },
  plugins: [],
};

export default config;
