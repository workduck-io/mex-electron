import { app } from 'electron'
import installExtensions, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'

import { checkIfAlpha } from './version'

const isDevelopment = import.meta.env.MODE === 'development'

const extensionsForDevX = async () => {
  const isAlpha = checkIfAlpha(app.getVersion())
  const extensions = [REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS]

  if (isAlpha || isDevelopment) {
    installExtensions(extensions)
      .then((name) => console.log(`Added Extensions: ${name}`))
      .catch((err) => console.log(`An error occurred: ${err}`))
  }
}

export default extensionsForDevX
