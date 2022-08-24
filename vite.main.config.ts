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
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  ssr: {
    noExternal: ['nanoid']
  },
  build: {
    ssr: true,
    sourcemap: 'inline',
    target: `node16`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: 'src/electron/main.ts',
      formats: ['cjs']
    },
    rollupOptions: {
      external: ['electron', 'electron-devtools-installer', ...builtinModules],
      output: {
        entryFileNames: '[name].cjs'
      }
    },
    emptyOutDir: true,
    reportCompressedSize: false
  },
  worker: {
    format: 'es'
  }
}

export default config
