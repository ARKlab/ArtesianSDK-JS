const path = require("path");
const EmitAllPlugin = require("webpack-emit-all-plugin");

module.exports = [
  {
    mode: "production",
    entry: "./src/index.ts",
    output: {
      library: "Artesian",
      libraryTarget: "umd",
      filename: "artesian.umd.js",
      path: path.resolve(__dirname, "../dist/bundles")
    },
    devtool: "source-map",
    node: {
      process: false
    },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: [".ts", ".js"]
    },
    module: {
      rules: [
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        {
          test: /\.ts$/,
          loader: "ts-loader",
          options: {
            configFile: "config/tsconfig.json",
            compilerOptions: {
              declaration: false,
              sourceMap: true,
              inlineSourceMap: false
            }
          }
        }
      ]
    }
  }
];
