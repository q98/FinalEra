const path = require("path")
const merge = require("webpack-merge")

const common = require("./webpack.config.common")

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        contentBase: path.resolve(__dirname, "./dist"),
        compress: true,
        host: '0.0.0.0',
        port: 9000,
    },
})
