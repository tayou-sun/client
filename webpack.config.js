const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: ["react-hot-loader/patch", "./src/index.js", "./less/styles.less"],
  output: {
    path: __dirname + "/public",
    publicPath: "/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: "./public",
    port: 3000,
    hot: true,
    historyApiFallback: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles.css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        loader: "file-loader?name=[name].[ext]"
      },
      {
        test: /\.(gif|jpg|png)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images/"
            }
          }
        ]
      },
      {
        test: /(webfont)+.(eot|ttf|svg|woff)+$/,
        use: [
          {
            loader: "file-loader?prefix=fonts",
            options: {
              name: "fonts/[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      pages: path.resolve(__dirname, "src/pages/"),
      components: path.resolve(__dirname, "src/components/"),
      cmp: path.resolve(__dirname, "src/components/"),
      node_modules: path.resolve(__dirname, "node_modules/"),
      layout: path.resolve(__dirname, "src/components/layout/"),
      common: path.resolve(__dirname, "src/common/"),
      icons: path.resolve(__dirname, "img/icons/"),
      api: path.resolve(__dirname, "src/api/"),
      config: path.resolve(__dirname, "src/config/"),
      svg: path.resolve(__dirname, "svg/")
    },
    extensions: ["*", ".js", ".jsx"]
  }
};
