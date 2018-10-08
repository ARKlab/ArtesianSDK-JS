module.exports = {
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testRegex: "tests.*test.ts$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globals: {
    "ts-jest": {
      tsConfig: "./config/tsconfig.json"
    }
  }
};
