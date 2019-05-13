var path = require('path');

module.exports = {
	output: {
		path: path.resolve(__dirname),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				
				use: [
					{
						loader: "babel-loader",

						options: {
							presets: [
								'@babel/preset-env',
								'@babel/preset-react'
							],
							
							plugins: [
								[
									"@babel/transform-react-jsx", {
										"pragma": "h"
									}
								]
							]

						}
					}
				]

			}
		]
	}
};
