/// <reference types="@welldone-software/why-did-you-render" />

import { IS_DEV } from '@data/Defaults/dev_'
import React from 'react'

if (IS_DEV) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {
    trackAllPureComponents: true
  })
}
