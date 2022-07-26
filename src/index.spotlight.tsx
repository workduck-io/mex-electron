import React from 'react'
import App from './app.spotlight'
import { createRoot } from 'react-dom/client'
import analytics from './services/analytics/analaytics'
import config from './services/analytics/config'

analytics(config.heap.HEAP_PREFIX, config.heap.APP_ID)
const root = createRoot(document.getElementById('spotlight'))

root.render(<App />)
