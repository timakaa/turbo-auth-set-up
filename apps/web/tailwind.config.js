/** @type {import('tailwindcss').Config} */
module.exports = {
  // Reuse the UI package config
  presets: [require("@repo/ui/tailwind.config")],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Include UI package components
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};
