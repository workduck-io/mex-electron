/* eslint-env node */
import react from '@vitejs/plugin-react'
import fs from 'fs'
import { builtinModules } from 'module'
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
    fs: {
      strict: true
    }
  },
  build: {
    ssr: true,
    sourcemap: true,
    target: `chrome96`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      external: [...builtinModules]
    },
    emptyOutDir: false,
    reportCompressedSize: false
  }
}

export default config
