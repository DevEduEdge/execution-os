import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#080b0f",
        panel: "#111820",
        panelSoft: "#17212b",
        line: "#263241",
        textMain: "#f5f7fa",
        textSoft: "#a9b4c0",
        action: "#26d07c",
        actionDark: "#15945a",
        amber: "#f6b84b",
        danger: "#ff5e5b",
        cyan: "#43c6db"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(38, 208, 124, 0.2), 0 18px 60px rgba(0, 0, 0, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
