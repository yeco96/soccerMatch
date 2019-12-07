var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

exports.context = path.join(__dirname, 'src');

exports.entry = {
    'app': './app/index.js'
};

exports.output = {
    path: './public/',
    filename: '[name].bundle.js'
};

exports.devtool = 'source-map';

exports.module = {
    loaders: [
        { test: /\.css$/, loader: 'style!css', exclude: /node_modules/ },
        { test: /\.html$/, loader: 'html', exclude: /node_modules/ },
        { test: /\.json$/, loader: 'file', exclude: /node_modules/ }
    ]
};

exports.plugins = [
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
        inject: true,
        hash: true,
        template: 'index.html',
        filename: 'index.html'
    }),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
    })
];

