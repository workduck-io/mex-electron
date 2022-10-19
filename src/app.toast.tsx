import React from 'react'

import Providers from '@store/Context/Providers'

import Notifier from './components/toast/Notifier'
import { initializeSentry } from './services/sentry'
import GlobalStyle from './style/spotlight/global'

initializeSentry()

export default function App() {
  return (
    <Providers>
      <Notifier />
      <GlobalStyle />
    </Providers>
  )
}
