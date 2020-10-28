const path = require("path");
const tailwindcss = require("tailwindcss")("./tailwind.config.js");
const autoprefixer = require("autoprefixer");

module.exports = {
  style: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  devServer: {
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
};
