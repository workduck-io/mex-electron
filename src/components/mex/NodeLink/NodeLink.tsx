import Tippy, { TippyProps } from '@tippyjs/react'
import React, { useEffect } from 'react'
import tinykeys from 'tinykeys'
import EditorPreview from '../../../editor/Components/EditorPreview/EditorPreview'
import { useOnMouseClick } from '../../../editor/Components/ilink/hooks/useOnMouseClick'
import { useLinks } from '../../../hooks/useLinks'
import useLoad from '../../../hooks/useLoad'
import { useNavigation } from '../../../hooks/useNavigation'
import { mog } from '../../../utils/lib/helper'
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
  const { loadNode } = useLoad()
  const { goTo } = useRouting()
  const { push } = useNavigation()

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
  mog('NodeLink', { nodeid, preview, icon, visible, fixVisible })

  return (
    <EditorPreview
      key={keyStr}
      preview={visible || fixVisible}
      closePreview={() => closePreview()}
      allowClosePreview={fixVisible}
      nodeid={nodeid}
      placement="auto"
    >
      <NodeLinkStyled
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        selected={fixVisible}
        key={`NodeLink_${keyStr}`}
        {...onClickProps}
      >
        {getPathFromNodeid(nodeid)}
      </NodeLinkStyled>
    </EditorPreview>
  )
}

export default NodeLink
