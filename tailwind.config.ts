import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        green: {
          DEFAULT: '#00FF00', // Default shade of green
          dark: '#008000', // Darker shade of green
          light: '#90EE90', // Lighter shade of green
        },
        // Add more custom colors as needed
      },
    },
  },
  plugins: [],
};
export default config;
