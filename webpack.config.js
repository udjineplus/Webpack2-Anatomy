const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

const isProd = process.env.NODE_ENV === 'production';
const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
const cssProd = ExtractTextPlugin.extract(
	 {
		fallbackLoader: 'style-loader',
		loader: ['css-loader', 'sass-loader'],
		publicPath: '/dist'
	 });
const cssConfig = isProd ? cssProd : cssDev;

const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
	entry: {
		app: './src/app.js',
		contact: './src/contact.js',
		bootstrap: bootstrapConfig
	},
	output: {
		path:  path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{test: /\.scss$/, 
			 use: cssConfig
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.pug$/,
				use: 'pug-loader'
			},
			{
				test: /\.(jpe?g|png|gif)(\?.*)?$/,
				use: [
				      'file-loader?name=images/[name].[ext]', 	
				      //'file-loader?name=[name].[ext]&outputPath=images/', 
				      {
					loader: 'image-webpack-loader',
					options: {}
				      }
				     ]
			},
		    	{ 
				test: /\.(woff2?|svg)$/, 
				loader: 'url-loader?limit=10000&name=fonts/[name].[ext]' 
			},
		    	{ 
				test: /\.(ttf|eot)$/, 
				loader: 'file-loader?name=fonts/[name].[ext]' 
			},
			{ 
				test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, 
				loader: 'imports-loader?jQuery=jquery' 
			}


		]
	},
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		compress: true,
		port: 9000,
		stats: 'errors-only',
		open: true,
		hot: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Project Demo',
			minify: {
				collapseWhitespace: true
			},
			hash: true,
			excludeChunks: ['contact'],
			template: './src/index.pug'	
		}),
		new HtmlWebpackPlugin({
			title: 'Contact Page',
			minify: {
				collapseWhitespace: true
			},
			hash: true,
			chunks: ['contact'],
			filename: 'contact.html',
			template: './src/contact.html'	
		}),
		new ExtractTextPlugin({
			filename: '/css/[name].css',
			disable: !isProd,
			allChunks: true
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new PurifyCSSPlugin({
			paths: glob.sync(path.join(__dirname, 'src/*.html')),
		})
	]
}
