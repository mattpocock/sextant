const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/**.tsx", "./src/**/**.ts"],
  theme: {
    extend: {
      colors: {
        primary: defaultTheme.colors.indigo,
      },
    },
  },
  variants: [
    "responsive",
    "group-hover",
    "disabled",
    "focus-within",
    "hover",
    "focus",
    "active",
  ],
  plugins: [],
};
