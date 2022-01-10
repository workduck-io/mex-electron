import React from 'react'
import styled from 'styled-components'
import SideBar from '../Components/Sidebar'
import ContentEditor from '../Editor/ContentEditor'
import { useTreeFromLinks } from '../Editor/Store/DataStore'
import { useEditorStore } from '../Editor/Store/EditorStore'
import InfoBar from '../Layout/InfoBar'
import { ErrorBoundary } from 'react-error-boundary'
import useLoad from '../Hooks/useLoad/useLoad'
import EditorErrorFallback from '../Components/Error/EditorErrorFallback'

const EditorViewWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`

const EditorView = () => {
  const Tree = useTreeFromLinks()
  const { loadNode } = useLoad()
  const node = useEditorStore((s) => s.node)

  const resetEditor = () => {
    loadNode(node.uid, { fetch: false, savePrev: false })
  }

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
