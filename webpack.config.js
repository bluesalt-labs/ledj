var webpack = require('webpack');
var path = require('path');

var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var env = process.env.WEBPACK_ENV;

var plugins = [], outputJSFile, outputCSSFile;
var libraryName = 'ledj';

if (env === 'build') {
    outputJSFile = libraryName + '.min.js';
    outputCSSFile = libraryName + '.min.css';

    plugins.push(new UglifyJsPlugin({ minimize: true }));
} else {
    outputJSFile = libraryName + '.js';
    outputCSSFile = libraryName + '.css';
}

plugins.push(new ExtractTextPlugin(outputCSSFile));

module.exports = {
    entry: __dirname + '/src/app.js',
    devtool: 'source-map',
    output: {
        path: __dirname + '/dist',
        filename: outputJSFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devServer: {
        contentBase: [path.join(__dirname, "docs"), path.join(__dirname, "dist")],
        open: '/local.html',
        compress: true,
        port: 8080
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: {
                        loader: 'css-loader',
                        options: {
                            minimize: (env === 'build')
                        }
                    }
                })
            }
        ]
    },
    plugins: plugins
};
