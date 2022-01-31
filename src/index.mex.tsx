import React from 'react'
import App from './app.mex'
import { render } from 'react-dom'
import analytics from './services/analytics/analaytics'
import config from './services/analytics/config'

analytics(config.heap.HEAP_PREFIX, config.heap.APP_ID)

render(<App />, document.getElementById('root'))
