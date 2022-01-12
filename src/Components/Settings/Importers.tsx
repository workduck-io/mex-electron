import React from 'react'
import { Button } from '../../Styled/Buttons'
import toast from 'react-hot-toast'
import { Wrapper } from '../../Styled/Layouts'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../../Spotlight/utils/constants'
import { Card } from '../../Styled/Card'
import styled from 'styled-components'

export const ImporterCard = styled(Card)`
  height: 200px;
`

const Importers = () => {
  const importAppleNotes = () => {
    toast('Importing Apple Notes! This might take a while', { duration: 3000 })
    ipcRenderer.send(IpcAction.IMPORT_APPLE_NOTES)
  }
  return (
    <Wrapper>
      <Button onClick={importAppleNotes}>
        <ImporterCard>
          <h2>Import Apple Notes!</h2>
          <ul>
            <li>Mex will ask for permission to access Notes next</li>
            <li>Pick the notes you would like to see in Mex</li>
            <li>The Notes will be imported under the &#34;Apple Notes&#34; Hierarchy</li>
          </ul>
          <h4>Please close the Apple Notes app if it is open before importing your notes</h4>
        </ImporterCard>
      </Button>
    </Wrapper>
  )
}

export default Importers
