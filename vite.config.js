import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 相对 base：构建产物可放在任意子路径下（GitHub Pages 项目站 /zihao-awa/ 可直接跑），
  // 以后换自定义域名（根路径）也无需再改。
  base: './',
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
})
