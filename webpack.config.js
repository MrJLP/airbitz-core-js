module.exports = {
  entry: {
    abc: './src/abc-web.js',
    abcui: './ui/src/abcui.js'
  },
  output: {
    filename: '[name].js',
    // Export the library as a global var:
    libraryTarget: "var",
    // Name of the global var:
    library: "[name]"
  }
}
