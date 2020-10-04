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
  variants: {},
  plugins: [],
};
