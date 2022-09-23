const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');

module.exports = [
	{
		entry: './src/main.ts',
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
		},
		resolve: {
			extensions: ['.ts', '.tsx']
		},
	},
	{
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
			new HtmlWebpackPlugin(),
			new CopyWebpackPlugin({
				patterns: [
					{
						from: 'static/**/*',
					}
				]
			}),
			new CspHtmlWebpackPlugin({
				'script-src': "'self'",
				'style-src': "'self'",
				'connect-src': "ws://localhost:8000",
			}, {
				nonceEnabled: {
					'script-src': false,
					'style-src': false,
				},
			}),
		],
		resolve: {
			extensions: ['.ts', '.tsx']
		},
	}
];