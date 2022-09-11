import React from 'react'

import { createRoot } from 'react-dom/client'

import App from './app.note'

const root = createRoot(document.getElementById('note'))
root.render(<App />)
