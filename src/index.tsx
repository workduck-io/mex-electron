import React from 'react'
import { render } from 'react-dom'
import App from './App'

require('electron-cookies')

render(<App />, document.getElementById('root'))
