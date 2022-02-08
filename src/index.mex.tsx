import React from 'react'
import App from './app.mex'
import { render } from 'react-dom'
import analytics from './services/analytics/analaytics'
import config from './services/analytics/config'

try {
  analytics(config.heap.HEAP_PREFIX, config.heap.APP_ID)
} catch (e) {
  console.error('ANALYTICS ERROR: Could not be setup', { e })
}

render(<App />, document.getElementById('root'))
