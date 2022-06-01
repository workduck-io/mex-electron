import { SharedNodeIcon } from '@components/icons/Icons'
import { useNodes } from '@hooks/useNodes'
import React, { useEffect } from 'react'
import tinykeys from 'tinykeys'
import EditorPreview from '../../../editor/Components/EditorPreview/EditorPreview'
import { useOnMouseClick } from '../../../editor/Components/ilink/hooks/useOnMouseClick'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { NodeType } from '../../../types/Types'
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
  const [visible, setVisible] = React.useState(false)
  const [fixVisible, setFixVisible] = React.useState(false)
  const { getPathFromNodeid } = useLinks()
  // const { loadNode } = useLoad()
  const { getNodeType } = useNodes()
  const { goTo } = useRouting()
  const { push } = useNavigation()

  const nodeType = getNodeType(nodeid)

  const onClickProps = useOnMouseClick(() => {
    // Show preview on click, if preview is shown, navigate to link
    if (!fixVisible) setFixVisible(true)
    else {
      push(nodeid)
      goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
    }
  })

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        closePreview()
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const closePreview = () => {
    setVisible(false)
    setFixVisible(false)
  }

  // useEffect(() => {
  //   // If the preview is shown and the element losses focus --> Editor focus is moved
  //   // Hide the preview
  //   if (preview && !selected) setPreview(false)
  // }, [selected])
  // mog('NodeLink', { nodeid, preview, icon, visible, fixVisible })

  return (
    <EditorPreview
      key={keyStr}
      preview={visible || fixVisible}
      closePreview={() => closePreview()}
      allowClosePreview={fixVisible}
      nodeid={nodeid}
      placement="auto-start"
    >
      <NodeLinkStyled
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        selected={fixVisible}
        key={`NodeLink_${keyStr}`}
        {...onClickProps}
      >
        {nodeType === NodeType.SHARED && <SharedNodeIcon />}

        {getPathFromNodeid(nodeid, true)}
      </NodeLinkStyled>
    </EditorPreview>
  )
}

export default NodeLink
