import React from 'react'
import EditorPreview from '../../../editor/Components/EditorPreview/EditorPreview'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { mog } from '../../../utils/lib/helper'
import { NodeLinkStyled } from '../Backlinks/Backlinks.style'

interface NodeLinkProps {
  keyStr: string
  nodeid: string

  // Show preview (default true)
  preview?: boolean
  icon?: boolean
}

const NodeLink = ({ nodeid, preview = true, icon, keyStr }: NodeLinkProps) => {
  const { getNodeIdFromUid } = useLinks()
  const { push } = useNavigation()
  // mog('NodeLink', { nodeid, preview, icon })
  return (
    <EditorPreview key={keyStr} nodeid={nodeid} placement="left">
      <NodeLinkStyled key={`NodeLink_${keyStr}`} onClick={() => push(nodeid)}>
        {getNodeIdFromUid(nodeid)}
      </NodeLinkStyled>
    </EditorPreview>
  )
}

export default NodeLink
