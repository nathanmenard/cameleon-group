

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: "#0a0a0a",
        blanc: "#ffffff",
        "gris-50": "#f8f8f8",
        "gris-100": "#f0f0f0",
        "gris-200": "#e0e0e0",
        "gris-300": "#d0d0d0",
        "gris-400": "#a0a0a0",
        "gris-500": "#707070",
        "gris-600": "#505050",
        "gris-700": "#333333",
        "gris-800": "#1a1a1a",
        rouge: "#B22222",
        "rouge-vif": "#FF4A48",
        "rouge-sombre": "#992C2B",
      },
      fontFamily: {
        serif: ["Newsreader", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
