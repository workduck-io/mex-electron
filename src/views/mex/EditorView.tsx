import React from 'react'
import styled from 'styled-components'
import SideBar from '../../components/mex/Sidebar'
import ContentEditor from '../../editor/ContentEditor'
import { useTreeFromLinks } from '../../store/useDataStore'
import InfoBar from '../../components/layouts/InfoBar'
import { ErrorBoundary } from 'react-error-boundary'
import EditorErrorFallback from '../../components/mex/Error/EditorErrorFallback'
import useEditorActions from '../../hooks/useEditorActions'
import { Outlet } from 'react-router-dom'

const EditorViewWrapper = styled.div`
  display: flex;
  align-items: center;
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
        <Outlet />
      </ErrorBoundary>
      <InfoBar />
    </EditorViewWrapper>
  )
}

export default EditorView
