var path = require('path')
var webpack = require('webpack')
var HtmlWebPackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: ['whatwg-fetch', 'core-js/fn/promise', path.resolve(__dirname, './src/main.js')],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'vue-simple-suggest': path.resolve(__dirname, '../lib/vue-simple-suggest.vue')
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    contentBase: __dirname,
    historyApiFallback: true,
    noInfo: false,
    overlay: true
  },
  performance: {
    hints: false
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, './src/index.ejs')
    }),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, 'src/assets'), to: path.resolve(__dirname, '../docs/assets') }
    ])
  ],
  output: {
    path: path.resolve(__dirname, "../docs")
  }
}
