import React from 'react'
import styled from 'styled-components'
import SideBar from '../Components/Sidebar'
import ContentEditor from '../Editor/ContentEditor'
import { useTreeFromLinks } from '../Editor/Store/DataStore'
import InfoBar from '../Layout/InfoBar'
import { ErrorBoundary } from 'react-error-boundary'
import EditorErrorFallback from '../Components/Error/EditorErrorFallback'
import useEditorActions from '../Hooks/useEditorActions'

const EditorViewWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`

const EditorView = () => {
  const Tree = useTreeFromLinks()

  const { resetEditor } = useEditorActions()

  return (
    <EditorViewWrapper>
      <SideBar tree={Tree} starred={Tree} />
      <ErrorBoundary onReset={resetEditor} FallbackComponent={EditorErrorFallback}>
        <ContentEditor />
      </ErrorBoundary>
      <InfoBar />
    </EditorViewWrapper>
  )
}

export default EditorView
