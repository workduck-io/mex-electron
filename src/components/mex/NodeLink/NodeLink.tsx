import React from 'react'
import EditorPreview from '../../../editor/Components/EditorPreview/EditorPreview'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { mog } from '../../../utils/lib/helper'
import { NodeLinkStyled } from '../Backlinks/Backlinks.style'

interface NodeLinkProps {
  key: string
  nodeid: string
  // Show preview (default true)
  preview?: boolean
  icon?: boolean
}

const NodeLink = ({ nodeid, preview = true, icon, key }: NodeLinkProps) => {
  const { getNodeIdFromUid } = useLinks()
  const { push } = useNavigation()
  mog('NodeLink', { nodeid, preview, icon })
  return (
    <EditorPreview nodeid={nodeid} placement="left">
      <NodeLinkStyled key={key} onClick={() => push(nodeid)}>
        {getNodeIdFromUid(nodeid)}
      </NodeLinkStyled>
    </EditorPreview>
  )
}

export default NodeLink
