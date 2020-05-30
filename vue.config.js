module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Grateful4 v0.01',
    },
  },
};
