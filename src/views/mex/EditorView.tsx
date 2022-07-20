import React from 'react'
import styled from 'styled-components'
import InfoBar from '@components/mex/RHSidebar/InfoBar'
import { ErrorBoundary } from 'react-error-boundary'
import EditorErrorFallback from '../../components/mex/Error/EditorErrorFallback'
import useEditorActions from '../../hooks/useEditorActions'
import { Outlet } from 'react-router-dom'

const EditorViewWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`

const EditorView = () => {
  const { resetEditor } = useEditorActions()

  return (
    <EditorViewWrapper>
      <ErrorBoundary onReset={resetEditor} FallbackComponent={EditorErrorFallback}>
        <Outlet />
      </ErrorBoundary>
      {/* <InfoBar /> */}
    </EditorViewWrapper>
  )
}

export default EditorView
