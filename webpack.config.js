// Inside of webpack.config.js:
const WorkboxPlugin = require('workbox-webpack-plugin');
var path = require('path');

module.exports = {
  entry: './src/form.js',

  output: {
    filename: 'form.js',
    // path: './here'//path.join('public', 'javascripts')
    path: path.resolve(__dirname, 'public')

  },

  resolve: {
    extensions: ['.js', '.jsx']
  },
  mode: 'development',

  plugins: [
    // Other plugins...

    // new WorkboxPlugin.InjectManifest({
    //   swSrc: './src/sw.js',
    // })
  ]
};