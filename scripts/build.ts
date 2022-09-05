import { dirname } from 'path'
import { build } from 'vite'

const appMode = (process.env.MODE = process.env.MODE || 'production')
const packagesConfig = [
  'vite.main.config.ts',
  'vite.mex.config.ts',
  'vite.spotlight.config.ts',
  'vite.toast.config.ts',
  'vite.note.config.ts'
]

const buildByConfig = (configFile: string) => build({ configFile, mode: appMode })

const main = async () => {
  try {
    const totalTimeLabel = 'Total bundling time'
    console.time(totalTimeLabel)

    for (const packageConfigPath of packagesConfig) {
      const consoleGroupName = `${dirname(packageConfigPath)}/`
      console.group(consoleGroupName)

      const timeLabel = 'Bundling time'
      console.time(timeLabel)

      await buildByConfig(packageConfigPath)

      console.timeEnd(timeLabel)
      console.groupEnd()
      console.log('\n') // Just for pretty print
    }
    console.timeEnd(totalTimeLabel)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
