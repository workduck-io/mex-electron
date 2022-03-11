import React from 'react'
import EditorPreview from '../../../editor/Components/EditorPreview/EditorPreview'
import { useLinks } from '../../../hooks/useLinks'
import useLoad from '../../../hooks/useLoad'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import { NodeLinkStyled } from '../Backlinks/Backlinks.style'

interface NodeLinkProps {
  keyStr: string
  nodeid: string

  // Show preview (default true)
  preview?: boolean
  icon?: boolean
}

const NodeLink = ({ nodeid, preview = true, icon, keyStr }: NodeLinkProps) => {
  const { getPathFromNodeid } = useLinks()
  const { loadNode } = useLoad()
  const { goTo } = useRouting()
  // mog('NodeLink', { nodeid, preview, icon })
  return (
    <EditorPreview key={keyStr} nodeid={nodeid} placement="left">
      <NodeLinkStyled
        key={`NodeLink_${keyStr}`}
        onClick={() => {
          loadNode(nodeid, { savePrev: false })
          goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
        }}
      >
        {getPathFromNodeid(nodeid)}
      </NodeLinkStyled>
    </EditorPreview>
  )
}

export default NodeLink
