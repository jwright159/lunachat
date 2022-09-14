const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
	{
		mode: 'development',
		entry: './src/main.tsx',
		target: 'electron-main',
		module: {
			rules: [{
				test: /\.ts(x?)$/,
				include: /src/,
				use: [{ loader: 'ts-loader' }]
			}]
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'main.js'
		}
	},
	{
		mode: 'development',
		entry: './src/renderer.tsx',
		target: 'electron-renderer',
		devtool: 'source-map',
		module: { rules: [{
			test: /\.ts(x?)$/,
			include: /src/,
			use: [{ loader: 'ts-loader' }]
		}] },
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'renderer.js'
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: './src/index.html'
			})
		]
	},
	{
		mode: 'development',
		entry: './src/preload.tsx',
		target: 'electron-preload',
		module: {
			rules: [{
				test: /\.ts(x?)$/,
				include: /src/,
				use: [{ loader: 'ts-loader' }]
			}]
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'preload.js'
		}
	}
];