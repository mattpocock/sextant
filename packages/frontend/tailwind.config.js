const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    purgeLayersByDefault: true,
  },
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
    "group-focus",
    "focus",
    "active",
  ],
  plugins: [],
};
