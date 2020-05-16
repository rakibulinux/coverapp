/* eslint-disable no-useless-escape */
const webpack = require("webpack");
const path = require("path");
const TransformModulesPlugin = require("webpack-transform-modules-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const isProduction = process.env.NODE_ENV === "production";

let configWebPack = {
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  chainWebpack: config => {
    config.plugins.delete("prefetch");
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {},
        javascriptEnabled: true
      }
    }
  },
  configureWebpack: smp.wrap({
    devtool:
      process.env.NODE_ENV === "development" ? "inline-source-map" : false,
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    optimization: {
      minimizer: [],
      splitChunks: {
        chunks: "all",
        name: "vendor"
      }
    },
    resolve: {
      extensions: ["*", ".js", ".ts", ".tsx", ".vue", ".json"]
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: "sass-loader",
              options: {}
            },
            {
              loader: "@epegzz/sass-vars-loader",
              options: {
                syntax: "scss",
                files: [path.resolve(__dirname, "src/colors.ts")]
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new TransformModulesPlugin(),
      new PreloadWebpackPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  }),
  productionSourceMap: false,
  devServer: {
    proxy: {
      "^/api": {
        target: "http://www.test.local",
        secure: false,
        ws: true,
        changeOrigin: true
      }
    },
    host: "0.0.0.0",
    port: 3000,
    hot: true,
    disableHostCheck: true
  }
};

if (isProduction) {
  configWebPack.configureWebpack.optimization.minimizer.push(
    new TerserPlugin({
      cache: true,
      parallel: true,
      sourceMap: false,
      terserOptions: {}
    })
  );
  configWebPack.configureWebpack.plugins.push(
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CompressionPlugin(),
    new HardSourceWebpackPlugin({
      cachePrune: {
        // Caches younger than `maxAge` are not considered for deletion. They must
        // be at least this (default: 2 days) old in milliseconds.
        maxAge: 2 * 24 * 60 * 60 * 1000,
        // All caches together must be larger than `sizeThreshold` before any
        // caches will be deleted. Together they must be at least this
        // (default: 50 MB) big in bytes.
        sizeThreshold: 1024 * 1024 * 1024
      }
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  );
}

module.exports = configWebPack;
