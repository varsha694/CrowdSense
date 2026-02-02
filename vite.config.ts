import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/CrowdSense/',
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
    ],
  },
  plugins: [react()],
})
