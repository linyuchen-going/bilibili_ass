/**
 * Created by linyuchen on 2017/8/3 0003.
 */

/**
 * Created by linyuchen on 2017/5/18.
 */

var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var DEBUG = true;
for(var i=0; i < process.argv.length; i++)
{
    if (process.argv[i] === '-p'){
        DEBUG = false;
        break;
    }
}

var config = {
    context: path.join(__dirname, 'src'),
    entry:{
        // "index": ["babel-polyfill", "./index.js"]
        "background": ["./Chrome/background.ts"],
        "av": ["./Chrome/Inject/av/index.tsx"],
        "eplist": ["./Chrome/Inject/eplist/index.tsx"],
    },
    output:{
        path: path.resolve(__dirname, "build"),
        filename: '[name].js',
    },
    externals: {
        // "vue": "Vue",
    },
    resolve:{
        extensions: [".js", ".ts", ".tsx"]
    },
    module:{
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.tsx?$/,
                // loader: "awesome-typescript-loader"
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.css$/,
                loader: ["style-loader", "css-loader?modules"]
            }
        ]
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     template: path.resolve(__dirname, "./src/Chrome/popup.html"),
        //     title: "bilibili",
        //     filename: "popup.html",
        //     chunks: []
        // })
    ],
    node: {
        // fs: "empty",
        // net: "empty"
    },

    target: "web"
};

if (DEBUG) {
    config.devtool = 'inline-source-map';
    config.watch = true;
    config.devServer = {
        disableHostCheck: true,
        hot: true,
        inline: true,
        proxy: {},
    };
}

module.exports = config;

