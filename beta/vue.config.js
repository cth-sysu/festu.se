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
  },
  devServer: {
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
