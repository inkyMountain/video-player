import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['lowdb']
      })
    ],
    build: {
      rollupOptions: {
        output: {
          // manualChunks(id) {
          //   const deps = ['lowdb']
          //   const dep = deps.find((dep) => id.includes(dep))
          //   if (dep) {
          //     return dep
          //   }
          //   return undefined
          // }
        }
      }
    }
  },
  preload: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['lowdb']
      })
    ]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
