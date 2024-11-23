export default {
  root: 'src',
  base: '/movie-app-tg/',
  build: {
    outDir: '../dist',
    rollupOptions: {
      external: [
        '@material/web/button/filled-tonal-button.js',
        '@material/web/checkbox/checkbox.js'
      ],
      output: {
        manualChunks: undefined
      }
    },
    sourcemap: true,
    minify: false
  },
  server: {
    host: true,
    port: 3000
  }
} 