const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const PostCssInlineSvg = require('postcss-inline-svg');
const PostCssSvgo = require('postcss-svgo');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const autoprefixerConfig = { browsers: ['last 5 versions', 'ie 11'] };
const postCssConfig = [autoprefixer(autoprefixerConfig), PostCssInlineSvg, PostCssSvgo];

const scssOptions = { sourceMap: isDevelopment };
const PAGES_DIR = path.join(__dirname, './src');
const PAGES = fs.readdirSync(PAGES_DIR).filter((fileName) => fileName.endsWith('.html'));

module.exports = {
  entry: {
    // vendor: ['./src/vendor/index.js'],
    common: ['./src/index.js'],
  },
  output: {
    path: path.resolve(__dirname, './public'),
    publicPath: '/',
    //   filename: isDevelopment ? '[name].js' : '[name]-[chunkhash:10].js'
    filename: 'js/[name].js',
  },
  externals: {
    jquery: 'jQuery',
    $: 'jQuery',
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      'jquery-ui': 'jquery-ui/ui/widgets',
      'jquery-ui-css': 'jquery-ui/../../themes/base',
      '@': path.resolve(__dirname, './src'),
    },
    symlinks: false,
  },
  watch: isDevelopment,
  devtool: isDevelopment ? 'inline-source-map' : false,
  devServer: {
    // proxy: {
    //   '/table': {
    //     target: 'http://',
    //     logLevel: 'debug',
    //     changeOrigin: true,
    //   },
    // },
    contentBase: path.join(__dirname, 'src/static/'),
    noInfo: isDevelopment,
    overlay: {
      warnings: true,
      errors: true,
    },
    quiet: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        loaders: [
          'babel-loader',
          {
            loader: 'eslint-loader',
            options: {
              emitError: true,
              failOnWarning: !isDevelopment,
              failOnError: true,
            },
          },
        ],
      },

      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: ExtractTextPlugin.extract({
              use: [
                {
                  loader: 'css-loader',
                  options: scssOptions,
                },
                {
                  loader: 'sass-loader',
                  options: scssOptions,
                },
              ],
              fallback: 'vue-style-loader', // <- это внутренняя часть vue-loader, поэтому нет необходимости его устанавливать через NPM
            }),
          },
          postcss: postCssConfig,
          // other vue-loader options go here
        },
      },

      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader',
          fallback: 'style-loader',
        }),
      },

      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader', // https://github.com/webpack-contrib/html-loader
          options: {
            // attrs: [':data-src'],
            attrs: [':src'],
            interpolate: true, // добавляет возможность вставлять в аттрибуты
            // элементов картинки через ES6 string interpolation синтаксис
          },
        },
      },

      {
        test: /\.(png|jpe?g|gif|webp)$/,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/',
            },
          },
          'img-loader',
        ],
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'audio/',
        },
      },
      {
        test: /\.mp4$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'video/',
        },
      },
      {
        test: /\.(svg)$/,
        include: [path.resolve(__dirname, './src/common.blocks')],
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/',
            },
          },
          'img-loader',
        ],
      },

      {
        test: /\.(svg|eot|ttf|woff|woff2)$/,
        exclude: [path.resolve(__dirname, './src/assets/svg'), path.resolve(__dirname, './src/common.blocks')],
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: [path.resolve(__dirname, './src/assets/svg/multicolor')],
        loaders: [
          {
            loader: 'svg-sprite-loader',
          },
          {
            loader: 'svgo-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        include: [path.resolve(__dirname, './src/assets/svg/monocolor')],
        loaders: [
          {
            loader: 'svg-sprite-loader',
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeUselessStrokeAndFill: true },
                { removeAttrs: { attrs: '(fill|id|fill-opacity)' } },
                { removeStyleElement: true },
              ],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: scssOptions,
            },
            {
              loader: 'sass-loader',
              options: scssOptions,
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins() {
                  return postCssConfig;
                },
              },
            },
          ],
          fallback: 'style-loader',
        }),
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['public'], {
      root: __dirname,
      verbose: true,
      dry: false,
    }),
    new webpack.NoEmitOnErrorsPlugin(), // otherwise error still gives a file
    new ExtractTextPlugin('css/[name].css'),
    new FriendlyErrorsWebpackPlugin(),
    new WebpackBuildNotifierPlugin({
      suppressSuccess: true,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: !isDevelopment,
    }),
    new CopyWebpackPlugin([{ from: 'src/static' }], {
      ignore: ['*.md'],
    }),
    ...PAGES.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: `${PAGES_DIR}/${page}`,
          filename: `./${page}`,
        }),
    ),
  ],
};

if (!isDevelopment) {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),
  );
  module.exports.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: "'production'",
      },
    }),
  );
}
