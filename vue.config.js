/* eslint-disable no-useless-escape */
const webpack = require("webpack");
const path = require("path");
const PostCompilePlugin = require("webpack-post-compile-plugin");
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

const configWebPack = {
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  chainWebpack: config => {
    config.plugins.delete("prefetch");
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          "info-color": "var(--info-color)",
          "warning-color": "var(--warning-color)",
          "error-color": "var(--down-color)",
          "success-color": "var(--up-color)",
          "link-color": "var(--blue-color)",
          "link-hover-color": "#22a3ff",
          "link-active-color": "#22a3ff",
          "link-hover-decoration": "#22a3ff",
          "text-color": "#fff",
          "component-background": "var(--bg-head-color)",
          "text-color-secondary": "var(--color-gray)",
          "border-color-base": "var(--border-color)",
          "border-color-split": "var(--bg-downdown-border-color)",
          "border-color-inverse": "var(--bg-downdown-border-color)",
          "heading-color": "#fff",
          "disabled-color": "hsla(0,0%,100%,.35)",
          "item-active-bg": "hsla(0,0%,100%,.05)",
          "item-hover-bg": "hsla(0,0%,100%,.05)"
        },
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
      alias: {
        "cube-ui-src": path.resolve(__dirname, "node_modules/cube-ui/src"),
        "cube-ui": "cube-ui/lib"
      },
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
      new PostCompilePlugin(),
      new TransformModulesPlugin(),
      new PreloadWebpackPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
      //new webpack.NormalModuleReplacementPlugin( /node_modules\/ant-design-vue\/lib\/style\/index\.less/, path.resolve(rootDir, 'src/myStylesReplacement.less') )
    ]
  }),
  productionSourceMap: false,
  devServer: {
    proxy: {
      "^/api": {
        target: "https://demo.zsmart.tech",
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
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new BundleAnalyzerPlugin()
  );
}

module.exports = configWebPack;
