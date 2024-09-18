const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const glob = require('glob');
const CopyPlugin = require("copy-webpack-plugin");
const cssPatterns = glob.sync('./src/app/**/**/*.css');
const cssFiles =[];
 cssPatterns.map(file => {
  cssFiles.push({ from: file, to: file.replace('./src/app/','') });

 });
 
console.log('css patterns:' + JSON.stringify(cssFiles));
// Function to generate entry points
const generateEntryPoints = () => {
  const tsFiles = glob.sync('./src/app/**/*.ts');
  const entryPoints = {};
  tsFiles.forEach(file => {
    const name = path.relative('./src/app', file).replace(/\.ts$/, '');
    entryPoints[name] = file;
  });
 // console.log(entryPoints);
  entryPoints['index'] = './src/index.ts';  // Add the main index.ts
 entryPoints['overallcss'] = './src/styles/styles.css'
  return entryPoints;
};

// Function to generate HTML plugins
const generateHtmlPlugins = () => {
  const htmlFiles = glob.sync('./src/app/**/*.html');
  const plugins = htmlFiles.map(file => {
    const name = path.relative('./src/app', file).replace(/\/index\.html$/, '').replace(/\\/g, '/');
    let control = name.replace('/index.html', '');
    // console.log('control: '+control + '/' + control.split('/')[1]);
    // console.log('name: '+name);
   // console.log('control: '+control +path.sep+ control.split(path.sep)[1]);
    return new HtmlWebpackPlugin({
      filename: name,  // Avoid creating extra directories
      template: file,
      chunks: [control + '/' + control.split('/')[1]],  // Ensure the corresponding bundle is included in each HTML file
    });
  });

  // Add the main index.html
  plugins.push(new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './src/index.html',
    chunks: []  // Main index.html might not need any specific chunks
  }));

  return plugins;
};

module.exports = {
  entry: generateEntryPoints(),
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    ...generateHtmlPlugins(),
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
    
    new CopyPlugin({
      patterns: [
        { from: "Supabase", to: "Supabase" },
		{ from: "./src/app/image-editor/images", to: "image-editor/images"}
      ].concat(cssFiles),
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 5001,
    open: true,
    historyApiFallback: true,
  },
};
