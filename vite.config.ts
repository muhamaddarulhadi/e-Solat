import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/e-Solat/' : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api/solat': {
        target: 'https://www.e-solat.gov.my',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/solat/, '/index.php')
      }
    }
  }
})
