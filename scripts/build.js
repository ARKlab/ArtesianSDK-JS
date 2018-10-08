const fs = require("fs-extra");
const execSync = require('child_process').execSync;
const webpack = require('webpack');
const webpackConfig = require('../config/webpack.config')

fs.emptyDirSync("./dist");
// fs.copySync("./src", "./dist");
execSync("tsc -p ./config/tsconfig.json")

const compiler = webpack(webpackConfig)
compiler.run();