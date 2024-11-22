export default {
  root: 'src',
  base: '/movie-app-tg/',
  build: {
    outDir: '../dist',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    host: true,
    port: 3000
  }
} 