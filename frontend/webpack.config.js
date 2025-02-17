const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',  // точка входа вашего приложения
  output: {
    path: path.resolve(__dirname, 'dist'),  // папка для собранных файлов
    filename: 'bundle.js',  // имя итогового бандла
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // использование babel для трансляции
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],  // поддержка .jsx файлов
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',  // шаблон для создания HTML
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),  // папка с результатами сборки (заменили contentBase на static)
    port: 3000,  // порт для dev-сервера
    hot: true,  // горячая перезагрузка
  },
};
