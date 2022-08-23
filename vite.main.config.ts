import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { builtinModules } from 'module'
import { join } from 'path'
import { UserConfig } from 'vite'
import commonjsExternals from 'vite-plugin-commonjs-externals'

const PACKAGE_ROOT = __dirname

const config: UserConfig = {
  mode: process.env.MODE,
  plugins: [
    viteCommonjs(),
    commonjsExternals({
      externals: ['path', /^electron(\/.+)?$/]
    })
  ],
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
      entry: 'src/main.dev.ts',
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
  }
}

export default config
