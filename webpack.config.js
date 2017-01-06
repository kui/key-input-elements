const DEBUG = process.env.NODE_ENV !== "production";
const webpack = require("webpack");
const BabiliPlugin = require("babili-webpack-plugin");

const plugins = [
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
];

if (!DEBUG) {
  plugins.push(new BabiliPlugin());
}

module.exports = {
  debug: DEBUG,
  devtool: DEBUG ? "inline-source-map" : "source-map",
  entry: "./src/key-input-registerer.js",
  output: {
    path: "./dist",
    filename: DEBUG ? "key-input-elements-debug.js" : "key-input-elements.js"
  },
  module: {
    loaders: [
      { test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader" }
    ]
  },
  plugins,
};
