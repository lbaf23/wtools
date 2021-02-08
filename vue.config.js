module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    },
    worker_loader: {
      test: /\.worker\.js$/,
      use: [{
        loader: 'worker-loader',
        options: {inline: true, fallback: false}
      }],
    }
  },
  transpileDependencies: [
    'quasar', 'worker_loader'
  ],
}
