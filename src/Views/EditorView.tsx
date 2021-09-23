import React from 'react'
import { useTreeFromLinks } from '../Editor/Store/DataStore'
import SideBar from '../Components/Sidebar'
import ContentEditor from '../Editor/ContentEditor'
import styled from 'styled-components'
import InfoBar from '../Layout/InfoBar'

const EditorViewWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const EditorView = () => {
  const Tree = useTreeFromLinks()

  return (
    <EditorViewWrapper>
      <SideBar tree={Tree} starred={Tree} />
      <ContentEditor />
      <InfoBar />
    </EditorViewWrapper>
  )
}

export default EditorView
