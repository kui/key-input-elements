const path = require("path");
const DEBUG = process.env.NODE_ENV !== "production";

module.exports = {
  mode: DEBUG ? "development" : "production",
  devtool: DEBUG ? "inline-source-map" : "source-map",
  entry: "./src/key-input-registerer.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: DEBUG ? "key-input-elements-debug.js" : "key-input-elements.js"
  },
  module: {
    rules: [
      { test: /\.m?js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};
