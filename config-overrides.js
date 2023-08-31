const webpack = require("webpack");

module.exports = function override(config, env) {
  console.log("override");
  config.resolve.fallback = Object.assign(config.resolve.fallback || {}, {
    os: require.resolve("os-browserify/browser"),
    path: require.resolve("path-browserify"),
    fs: false,
    net: false,
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
    util: require.resolve("util/"),
    assert: require.resolve("assert/"),
    constants: require.resolve("constants-browserify"),
  });
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ]);

  return config;
};
