import React from 'react'

import NoteWindow from '@components/note'
import { GlobalNoteStyles } from '@components/note/styled'
import Providers from '@store/Context/Providers'
import { HashRouter, Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <Providers>
      <HashRouter>
        <Routes>
          <Route index element={<NoteWindow />} />
        </Routes>
      </HashRouter>
      <GlobalNoteStyles />
    </Providers>
  )
}
