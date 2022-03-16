import React from 'react'
import Metadata from './Metadata'
import { useEditorStore } from '../../../store/useEditorStore'
import BlockInfoBar from '../../../editor/Components/Blocks/BlockInfoBar'
import PublicNode from './PublicNode'
import useToggleElements from '../../../hooks/useToggleElements'

const EditorInfoBar = () => {
  const node = useEditorStore((store) => store.node)
  const { isBlockView, showShare } = useToggleElements()

  if (isBlockView) {
    return <BlockInfoBar />
  }

  if (showShare) {
    return <PublicNode />
  }

  return <Metadata node={node} />
}

export default EditorInfoBar
