const path = require('path');

module.exports = {
  entry: `./src/index.js`,
  output: {
    filename: `main.js`,
    path: path.resolve(__dirname, `dist`)
  },
  devtool: `source-map`, 
  devServer: {
    contentBase: path.join(__dirname, `dist`), 
    publicPath: `http://localhost:8080/`, 
    hot: true,
    compress: true
  },
  module: {
      rules: [
          {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: `eslint-loader`,
              options: {}
          }
      ]
  }
};