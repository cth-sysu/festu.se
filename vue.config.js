module.exports = {
  lintOnSave: false,
  outputDir: 'static/dist',
  assetsDir: 'static',
  pages: {
    index: {
      title: 'Festkommittén FestU',
      entry: 'src/main.js'
    },
    login: {
      title: 'FestU | Login',
      entry: 'src/login.js'
    },
    admin: {
      title: 'FestU | Admin',
      entry: 'src/admin.js'
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
      },
      '/images': {
        target: 'http://localhost:5000'
      },
      '/login': {
        target: 'http://localhost:5000',
        bypass: (req) => req.method.toLowerCase() === 'post' ? null : req.url
      }
    }
  }
}
