const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: "node",
  entry: {
    app: path.join(__dirname, '../client/server-entry.js')
  },
  externals: Object.keys(require('../package.json').dependencies),
  output: {
    filename:'server-entry.js',
    path: path.join(__dirname, '../dist'),
    publicPath:'',
    libraryTarget: "commonjs2"
  },
  module: {
    rules:[{
      test:/\.(jsx|js)$/,
      loader:'babel-loader',
      exclude:/node_modules/
    }]
  },
  resolve: {
    extensions: ['.js','.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.API_BASE": '"http://127.0.0.1:3333"'
    })
  ]
}