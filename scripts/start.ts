import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import electronPath from 'electron'
import { OutputPlugin, RollupOutput, RollupWatcher } from 'rollup'
import { createServer, build, createLogger, LogLevel, InlineConfig, ViteDevServer } from 'vite'

const appMode = (process.env.MODE = process.env.MODE || 'development')

const LOG_LEVEL: LogLevel = 'info'

const sharedConfig: InlineConfig = {
  mode: appMode,
  build: {
    watch: {}
  },
  logLevel: LOG_LEVEL
}

/** Messages on stderr that match any of the contained patterns will be stripped from output


1.  warning about devtools extension
    https://github.com/cawa-93/vite-electron-builder/issues/492
    https://github.com/MarshallOfSound/electron-devtools-installer/issues/143
*/
const stderrFilterPatterns = [
  // warning about devtools extension
  // https://github.com/cawa-93/vite-electron-builder/issues/492
  // https://github.com/MarshallOfSound/electron-devtools-installer/issues/143
  /ExtensionLoadWarning/
]

interface WatcherProps {
  name: string
  configFile: string
  writeBundle: OutputPlugin['writeBundle']
}

type WatcherOutput = Promise<RollupOutput | RollupOutput[] | RollupWatcher>

const getWatcher = ({ name, configFile, writeBundle }: WatcherProps): WatcherOutput => {
  return build({
    ...sharedConfig,
    configFile,
    plugins: [{ name, writeBundle }]
  })
}

const setupMainPackageWatcher = (viteDevServer: ViteDevServer): WatcherOutput => {
  const protocol = `http${viteDevServer.config.server.https ? 's' : ''}:`
  const host = viteDevServer.config.server.host || 'localhost'
  const port = viteDevServer.config.server.port // Vite searches for and occupies the first free port: 3000, 3001, 3002 and so on
  process.env.VITE_MEX_DEV_SERVER_URL = `${protocol}//${host}:${port}/`
  process.env.VITE_SPOTLIGHT_DEV_SERVER_URL = `${protocol}//${host}:${port}/spotlight.html`
  process.env.VITE_TOAST_DEV_SERVER_URL = `${protocol}//${host}:${port}/toast.html`
  process.env.VITE_NOTE_WINDOW_DEV_SERVER_URL = `${protocol}//${host}:${port}/note.html`

  const logger = createLogger(LOG_LEVEL, {
    prefix: '[main]'
  })

  let spawnProcess: ChildProcessWithoutNullStreams | null = null

  return getWatcher({
    name: 'reload-app-on-main-package-change',
    configFile: 'vite.main.config.ts',
    writeBundle() {
      if (spawnProcess !== null) {
        spawnProcess.kill('SIGINT')
        spawnProcess = null
      }

      spawnProcess = spawn(String(electronPath), ['dist/main.cjs'])

      spawnProcess.stdout.on('data', (d) => d.toString().trim() && logger.warn(d.toString(), { timestamp: true }))

      spawnProcess.stderr.on('data', (d) => {
        const data = d.toString().trim()
        if (!data) return

        const mayIgnore = stderrFilterPatterns.some((r) => r.test(data))
        if (mayIgnore) return

        logger.error(data, { timestamp: true })
      })
    }
  })
}

const main = async () => {
  try {
    const mexDevServer = await createServer({
      ...sharedConfig,
      configFile: 'vite.mex.config.ts'
    })
    const spotlightDevServer = await createServer({
      ...sharedConfig,
      configFile: 'vite.spotlight.config.ts'
    })
    const toastDevServer = await createServer({
      ...sharedConfig,
      configFile: 'vite.toast.config.ts'
    })

    const noteWindowDevServer = await createServer({
      ...sharedConfig,
      configFile: 'vite.note.config.ts'
    })

    await mexDevServer.listen()
    await spotlightDevServer.listen()
    await toastDevServer.listen()
    await noteWindowDevServer.listen()

    await setupMainPackageWatcher(mexDevServer)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
