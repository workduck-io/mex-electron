import React, { useState } from 'react'
import styled from 'styled-components'
import { Header } from './Shortcuts'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../../../data/IpcAction'

const Container = styled.section`
  margin: 0 ${({ theme }) => theme.spacing.large};
`

const Margin = styled.div`
  margin: 0.5rem 1rem;
`

const AutoUpdate = () => {
  const [updateFreq, setUpdateFreq] = useState('3')

  const handleChange = (value) => {
    setUpdateFreq(value)
    ipcRenderer.send(IpcAction.SET_UPDATE_FREQ, { updateFreq: value })
  }

  return (
    <Container>
      <Header colored>Mex</Header>
      <Margin>
        <form>
          <label>
            How often do I check for updates? <span>&nbsp;&nbsp;</span>
            <select value={updateFreq} onChange={(e) => handleChange(e.target.value)}>
              <option value="3">Every 3 Hours</option>
              <option value="1">Every Hour</option>
              <option value="12">Every 12 Hours</option>
              <option value="24">Once a Day</option>
            </select>
          </label>
        </form>
      </Margin>
    </Container>
  )
}

export default AutoUpdate
