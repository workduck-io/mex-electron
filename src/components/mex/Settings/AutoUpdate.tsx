import React, { useState } from 'react'
import styled from 'styled-components'
import { Header } from './Shortcuts'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../../Spotlight/utils/constants'

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

/*
<form onSubmit={(e) => handleSubmit(e.target.value)}>
            <label>
              Pick your favorite flavor:
              <select value={updateFreq} onChange={(e) => setUpdateFreq(e.target.value)}>
                <option value=(3 * 60 * 60 * 1000)>Grapefruit</option>
                <option value="lime">Lime</option>
                <option value="coconut">Coconut</option>
                <option value="mango">Mango</option>
              </select>
            </label>
            <input type="submit" value="Submit" />
          </form>
*/
