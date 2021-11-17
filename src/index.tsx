import React from 'react'
import App from './App'
import { render } from 'react-dom'
import config from './analytics/config'
import analytics from './analytics/analaytics'

analytics(config.heap.HEAP_PREFIX, config.heap.APP_ID)

render(<App />, document.getElementById('root'))
