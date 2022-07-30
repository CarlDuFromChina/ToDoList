var path = require('path');
var webpack = require('webpack');

module.exports = function (env) {
  var pack = require('./package.json');
  var ExtractTextPlugin = require('extract-text-webpack-plugin');
  var HtmlWebpackPlugin = require('html-webpack-plugin');
  const CompressionWebpackPlugin = require('compression-webpack-plugin');
  const { CleanWebpackPlugin } = require("clean-webpack-plugin");

  var production = !!(env && env.production === 'true');
  var babelSettings = {
    extends: path.join(__dirname, '/.babelrc'),
  };

  var config = {
    entry: {
      app: './sources/app.js',
    },
    output: {
      path: path.join(__dirname, 'dist'),
      library: 'MyApp',
      libraryExport: 'default',
      libraryTarget: 'var',
      filename: 'app.js',
    },
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader?' + JSON.stringify(babelSettings),
        },
        {
          test: /\.(svg|png|jpg|gif)$/,
          loader: 'url-loader?limit=25000',
        },
        {
          test: /\.(less|css)$/,
          loader: ExtractTextPlugin.extract('css-loader!less-loader'),
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/, // 字体
          use: [
            {
              loader: 'file-loader',
              options: {
                limit: 10240,
                name: 'static/fonts/[name].[hash:8].[ext]'
              }
            }
          ]
        }
      ],
    },
    resolve: {
      extensions: ['.js'],
      modules: ['./sources', 'node_modules'],
      alias: {
        webix: path.resolve(
          __dirname,
          'node_modules',
          '@xbs',
          'webix-pro',
          `webix.${production ? 'min.' : ''}js`
        ),
        'jet-views': path.resolve(__dirname, 'sources/views'),
        'jet-locales': path.resolve(__dirname, 'sources/locales'),
      },
    },
    plugins: [
      new CleanWebpackPlugin(), // 打包前清理dist
      new CompressionWebpackPlugin({
        test:/\.js$|\.html$|.\css/, //匹配文件名
        threshold: 10240,//对超过10k的数据压缩
        deleteOriginalAssets: false //不删除源文件
      }),
      new ExtractTextPlugin('./app.css'),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, 'index.html'),
        inject: 'head',
        chunks: ['app'],
      }),
      new webpack.DefinePlugin({
        VERSION: `"${pack.version}"`,
        APPNAME: `"${pack.name}"`,
        PRODUCTION: production,
      }),
    ],
    devServer: {
      hot: true,
      contentBase: false, // since we use CopyWebpackPlugin.
      compress: true,
      host: 'localhost',
      port: 8080,
      proxy: [{
        context: ['/api'],
        target: 'http://localhost:6000',
        secure: false,
        changeOrigin: true,
        logLevel: 'debug'
      }]
    }
  };

  if (production) {
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        test: /\.js$/,
      })
    );
  }

  return config;
};
