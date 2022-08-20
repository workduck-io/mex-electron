import Providers from '@store/Context/Providers'
import React from 'react'
import Notifier from './components/toast/Notifier'
import { IS_DEV } from './data/Defaults/dev_'
import { initializeSentry } from './services/sentry'
import GlobalStyle from './style/spotlight/global'

if (!IS_DEV) initializeSentry()

export default function App() {
  return (
    <Providers>
      <Notifier />
      <GlobalStyle />
    </Providers>
  )
}
