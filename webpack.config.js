// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const generate = require("generate-file-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const TEST_VAULT = "test-vault/.obsidian/plugins/obsidian-story-graph";

const config = {
  entry: "./src/main.ts",
  experiments: {
    outputModule: true,
  },
  output: {
    path: path.resolve(__dirname, TEST_VAULT),
    library: {
      // do not specify a `name` here
      type: "commonjs-static",
    },
    filename: "main.js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "./manifest.json",
          to: ".",
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "styles.css",
      chunkFilename: "[id].css",
    }),
    generate({
      file: ".hotreload",
      content: "",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { modules: true } },
          "sass-loader",
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
  externals: {
    electron: "commonjs2 electron",
    obsidian: "commonjs2 obsidian",
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
