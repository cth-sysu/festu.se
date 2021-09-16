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
        target: 'https://festu.se',
      },
      '/images': {
        target: 'https://festu.se'
      },
      '/login': {
        target: 'https://festu.se',
        bypass: (req) => req.method.toLowerCase() === 'post' ? null : req.url
      }
    }
  }
}
