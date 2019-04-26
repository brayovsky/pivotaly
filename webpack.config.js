const path = require('path')

module.exports = {
  entry: {
    main: './out/pivotaly'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
        {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        },
    ]
  },
  externals: {
    vscode: 'commonjs vscode'
  },
  devtool: 'source-map',
  target: 'node'
}
