import React from 'react'
import App from './app.mex'
import { createRoot } from 'react-dom/client'
import analytics from './services/analytics/analaytics'
import config from './services/analytics/config'

try {
  analytics(config.heap.HEAP_PREFIX, config.heap.APP_ID)
} catch (e) {
  console.error('ANALYTICS ERROR: Could not be setup', { e })
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
