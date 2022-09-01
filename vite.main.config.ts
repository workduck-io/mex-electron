import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
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
  plugins: [
    viteCommonjs(),
    commonjsExternals({
      externals: ['path', /^electron(\/.+)?$/]
    })
  ],
  resolve: {
    alias: aliases
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  ssr: {
    format: 'cjs'
  },
  build: {
    ssr: true,
    sourcemap: process.env.MODE === 'development',
    target: `node16`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/electron/main.ts'),
        analysis: path.resolve(__dirname, 'src/electron/worker/analysis.ts'),
        search: path.resolve(__dirname, 'src/electron/worker/search.ts')
      },
      external: ['electron', ...builtinModules, 'robotjs', 'chokidar', 'active-win-universal'],
      output: {
        entryFileNames: (assetInfo) => {
          switch (assetInfo.name) {
            case 'analysis':
              return 'analysis.js'

            case 'search':
              return 'search.js'

            default:
              return '[name].cjs'
          }
        }
      }
    },
    emptyOutDir: true,
    reportCompressedSize: false
  },
  worker: {
    format: 'iife'
  }
}

export default config
