import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  mode: 'dev',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8888,
    open: true,//自动打开浏览器
    fs: {
      strict: true,
    },
    proxy: {//配置允许将以 /dev-api 开头的请求代理到另一个服务器
      '/dev-api': {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev-api/, '')
      }
    }
  }
})
