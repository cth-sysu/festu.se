require('dotenv').config({
  path: require('path').resolve(process.cwd(), '..', '.env')
});

module.exports = {
  lintOnSave: false,
  outputDir: '../static/beta',
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
    index: 'login.html',
    historyApiFallback: {
      index: '/login.html'
    },
    proxy: {
      '/api': {
        target: 'https://festu.se',
        headers: {
          authorization: `Bearer ${process.env.TOKEN}`
        }
      },
      '/images': {
        target: 'https://festu.se'
      }
    }
  }
}
