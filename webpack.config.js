'use strict';

const path = require('path');

module.exports = {
    //export NODE_ENV=development
    // mode: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
    // devtool: 'inline-source-map',
    module: {
        rules: [
            // {
            //     test: /\.pug$/,
            //     loader: 'pug-plain-loader'
            // },
            // {
            //     test: /\.vue$/,
            //     loader: 'vue-loader',
            // },
            {
                type: 'javascript/auto',
                test: /\.(json|html)/,
                use: [{
                    loader: 'file-loader',
                    options: { name: '[name].[ext]' },
                }],
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                            plugins: [
                                "@babel/plugin-transform-runtime",
                                "@babel/plugin-transform-spread",
                            ],
                        },
                    },
                ]
            },
            // {
            //     test: /\.(png|svg|jpg|gif)$/,
            //     use: [
            //         'file-loader',
            //     ]
            // },
            // {
            //     test: /\.scss$/,
            //     use: [
            //         "style-loader",
            //         "css-loader",
            //         "sass-loader"
            //     ]
            // },
            // {
            //     test: /\.css$/,
            //     use: [
            //         "style-loader",
            //         "css-loader",
            //     ]
            // },
        ],
    },
    resolve: {
        extensions: ['*', '.js', '.json'],
    },
};
