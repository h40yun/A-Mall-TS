import { defineConfig } from 'vite'
import { copyFileSync } from 'fs'

export default defineConfig({
  build: {
    outDir: 'dist',
    target: 'es2020'
  },
  plugins: [{
    name: 'copy-404',
    closeBundle() {
      copyFileSync('404.html', 'dist/404.html')
    }
  }]
})
