const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode:'development',
  entry:'./app.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  module:{
    rules:[
      {
        test:/\.vue$/,
        loader:'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
       test: /\.(eot|woff2?|ttf|svg)$/,
       use: [
         {
           loader: "url-loader",
           options: {
             name: "[name]-[hash:5].min.[ext]",
           }
         }
       ]
     },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        options: {
          presets: ['@babel/preset-env'],
          plugins:  ["@babel/plugin-proposal-class-properties"]
        }
      },
      {
       test: /\.(png|jpe?g|gif)$/i,
       use: [
         {
           loader: 'file-loader',
         },
       ],
     }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    }
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title:'ciwi',
      template:'htmltemplate.html'
    }),
    new VueLoaderPlugin()
  ],
  devServer: {
      contentBase: './dist',
      hot: true,
    }
};
