const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  lintOnSave: true,

  configureWebpack: {
    devtool: "source-map",
    plugins: [new GenerateSW()]
  }
};
