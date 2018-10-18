module.exports = {
  lintOnSave: false,
  outputDir: '../static/beta',
  devServer: {
    proxy: {
      '/api': {
        target: 'https://festu.se'
      },
      '/images': {
        target: 'https://festu.se'
      }
    }
  }
}
