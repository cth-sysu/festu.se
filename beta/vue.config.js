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
    admin: {
      title: 'FestU | Admin',
      entry: 'src/admin.js'
    },
  },
  devServer: {
    index: 'admin.html',
    historyApiFallback: {
      index: '/admin.html'
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
