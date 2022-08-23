/* eslint-env node */
import react from '@vitejs/plugin-react'
import { builtinModules } from 'module'
import { join } from 'path'
import { UserConfig } from 'vite'
import commonjsExternals from 'vite-plugin-commonjs-externals'

const PACKAGE_ROOT = __dirname

const config: UserConfig = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/'
    }
  },
  plugins: [
    react(),
    commonjsExternals({
      externals: ['path', /^electron(\/.+)?$/]
    })
  ],

  base: '',
  server: {
    open: 'toast.html',
    fs: {
      strict: true
    }
  },
  build: {
    sourcemap: true,
    target: `chrome96`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      external: [...builtinModules],
      input: {
        index: 'toast.html'
      }
    },
    emptyOutDir: false,
    reportCompressedSize: false
  }
}

export default config
