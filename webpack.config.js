const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: { index: './src/index.js', },
    mode: process.env.NODE_ENV == 'production' ? 'production' : 'development',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inlineSource: '.(js|css)$',
            inject: 'body',
        }),
        new CopyPlugin({
            patterns: [
                { from: 'assets', to: 'assets', },
                { from: 'public', to: '.'},
                { from: 'src/pages', to: 'pages', },
            ]
        }),
        process.env.NODE_ENV == 'production' ? new HtmlInlineScriptPlugin() : { apply: () => {} },
    ],
    devServer: {
        host: '0.0.0.0',
        port: 8060,
        contentBase: './dist',
        historyApiFallback: true,
    },
    devtool: process.env.NODE_ENV == 'development' ? 'inline-source-map' : undefined,
    output: {
        // filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
            },
            {
                test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
                type: 'asset/inline',
            },
            // webp
            {
                test: /\.(webp)$/,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        modules: [
            'assets',
            'node_modules'
        ]
    }
}
