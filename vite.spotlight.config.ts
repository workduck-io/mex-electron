/* eslint-env node */
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { UserConfig } from 'vite'
import commonjsExternals from 'vite-plugin-commonjs-externals'

const PACKAGE_ROOT = __dirname

const aliases = fs
  .readdirSync('src', { withFileTypes: true })
  .filter((i) => i.isDirectory())
  .reduce((p, c) => {
    return { ...p, [`@${c.name}`]: path.resolve(__dirname, 'src', c.name) }
  }, {})

const config: UserConfig = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: aliases
  },
  plugins: [
    react(),
    commonjsExternals({
      externals: ['path', /^electron(\/.+)?$/]
    })
  ],

  base: '',
  server: {
    open: 'spotlight.html',
    fs: {
      strict: true
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  build: {
    minify: process.env.MODE !== 'development',
    sourcemap: process.env.MODE === 'development',
    target: `chrome96`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: {
        index: 'spotlight.html'
      }
    },
    emptyOutDir: false,
    reportCompressedSize: false
  }
}

export default config
