var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 代码入口
  entry: {
    wmsapp: path.resolve(__dirname, '../src/main/wmsapp.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/wmsapp/',
    filename: 'wmsapp-[name].js',
    chunkFilename: 'wmsapp-chunk-[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: (process.env.NODE_ENV === 'production') ? {
          	css: ExtractTextPlugin.extract({
	            use: 'css-loader',
	            fallback: 'vue-style-loader',
	    				publicPath: './', // 注意配置这一部分，根据目录结构自由调整
            })
          } : {},
          sourceMap: (process.env.NODE_ENV === 'production') ? false: true
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        loader: (process.env.NODE_ENV === 'production') ? ExtractTextPlugin.extract({ 
        	fallback: 'style-loader', 
        	use: 'css-loader',
        	publicPath: './', // 注意配置这一部分，根据目录结构自由调整
        }) : 'style-loader!css-loader',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  
  
  externals: {
    jQuery: 'window.$',
    bootstrap: 'bootstrap',
    mui: 'mui',
    moment: 'moment',
  },
  
  performance: {
    hints: false
  },
  
  devtool: '#eval-source-map',
  
  
  plugins: [
    new HtmlWebpackPlugin({
        title: 'Prodog',
        template: './static-wms-app/htmls/wmsapp.html',  // 源模板文件
        filename: (process.env.NODE_ENV === 'production') ? '../../wmsapp.html' : './index.html', // 输出文件【注意：这里的根路径是module.exports.output.path】
        chunks: ['wmsapp']
    })
  ]
}



if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
  
  module.exports.output.path = path.resolve(__dirname, '../dist/dist/wmsapp');

  module.exports.output.publicPath = './dist/wmsapp/';
  
	module.exports.output.filename = 'wmsapp-[chunkhash].js';
    
  module.exports.plugins = (module.exports.plugins || []).concat([
  	
    new ExtractTextPlugin("wmsapp-webpack.css"),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
    
  ])
}
