export const content = [
  "./index.html",
  "./src/**/*.{js,jsx}", // Add JSX file extensions for TailwindCSS to scan
  "./components/**/*.{js,ts,jsx,tsx}",
  "./pages/**/*.{js,ts,jsx,tsx}",
  "./layouts/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
    },
  },
};
export const plugins = [];
