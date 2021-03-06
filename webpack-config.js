const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DIR_CLIENT = 'src';
const DIR_DIST = 'build';

module.exports = function(options) {
  const plugins = [];
  const loaders = [];

  const production = process.env.NODE_ENV === 'production';
  const main = options.mainFile ||
    require('fs').existsSync(path.join(options.sourceDirectory || 'src', 'index.js')) ?
      path.join(options.sourceDirectory || 'src', 'index.js') :
      path.join(__dirname, 'sample', 'index.js');
  console.log(`Using ${main} as an entry script`);
  const index = options.indexFile ||
    require('fs').existsSync(path.join(process.cwd(), 'index.html')) ?
      path.join(process.cwd(), 'index.html') : path.join(__dirname, 'sample', 'index.html');
  console.log(`Using  ${index} as an index file`);

  const port = (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);
  var entry = path.resolve(process.cwd(), main);
  if (!production) {
    entry = [
      'webpack-dev-server/client?http://localhost:' + port, // Needed for hot reloading
      'webpack/hot/only-dev-server', // See above
      entry
    ];
  }
  if (!production) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new HtmlWebpackPlugin({ template: index, inject: true }));
  }
  if (production) {
    plugins.push(new HtmlWebpackPlugin({
      template: index,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true
    }));
  }
  plugins.push(new webpack.DefinePlugin({
    REACTUATE_DIRNAME: production ? 'undefined' : JSON.stringify(__dirname)
  }));
  if (production) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({ sourceMap: false, compress: { warnings: false } })
    );
  }
  plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }));
  const jsLoaders = [];
  const fs = require('fs');
  const deepestMerge = require('deepest-merge');
  var babelConfig = {
    presets: ['react', 'es2015', 'stage-0'],
    plugins: ['transform-export-extensions'],
    env: {
      development: { presets: ['react-hmre'] },
      production: {
        plugins: [
          'transform-react-remove-prop-types',
          'transform-react-constant-elements',
          'transform-react-inline-elements'
        ]
      }
    }
  };
  const babelrcFile = path.join(process.cwd(), '.babelrc');
  const defaultBabelrcFile = path.join(process.cwd(), '.babelrc.default');
  if (fs.existsSync(defaultBabelrcFile)) {
    console.log(`Using  ${defaultBabelrcFile}`);
    const defaultBabelrc = JSON.parse(fs.readFileSync(defaultBabelrcFile));
    babelConfig = deepestMerge(defaultBabelrc, babelConfig);
  }
  if (fs.existsSync(babelrcFile)) {
    console.log(`Using  ${babelrcFile}`);
    const babelrc = JSON.parse(fs.readFileSync(babelrcFile));
    babelConfig = deepestMerge(babelConfig, babelrc);
  }
  console.log(`Babel config: \n ${JSON.stringify(babelConfig, null, ' ')}`);
  jsLoaders.push('babel-loader?' + JSON.stringify(babelConfig));
  loaders.push({
    test: /\.(js|jsx)$/,
    loaders: jsLoaders,
    exclude: /node_modules\/(?!reactuate)/
  });
  var devtool = process.env.NODE_ENV === 'production' ? undefined : 'cheap-module-inline-source-map'
  loaders.push({ test: /\.json$/, loader: 'json'})
  loaders.push({ test: /\.css$/, loader: 'style!css!postcss'})
  loaders.push({ test: /\.less$/, loader: 'style!css!less'})
  loaders.push({ test: /\.woff(2)?(\?.+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' })
  loaders.push({ test: /\.ttf(\?.+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' })
  loaders.push({ test: /\.eot(\?.+)?$/, loader: 'file' },
   { test: /\.svg(\?.+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' })
  loaders.push({ test: /\.png$/, loader: 'url-loader?limit=100000' })
  loaders.push({ test: /\.jpg$/, loader: 'file-loader' })

  return {
    entry,
    devtool,
    plugins,
    postcss() {
      return [
        require('postcss-import')({
          resolve(id, base) {
            return require('globby').sync(path.join(base, id));
          },
          onImport: function (files) {
            files.forEach(this.addDependency);
          }.bind(this)
        })
      ];
    },
    output: {
      path: path.resolve(process.cwd(), DIR_DIST),
      publicPath: '/',
      filename: 'js/bundle.js'
    },
    resolve: {
      root: path.resolve(process.cwd(), DIR_CLIENT),
    },
    module: { loaders },
    target: 'web', // Make web variables accessible to webpack, e.g. window
    stats: false, // Don't show stats in the console
    progress: true
  };
};
