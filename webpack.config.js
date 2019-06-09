const path = require('path')

module.exports = {
  entry: './src/index.js',
  target: 'webworker',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
}
