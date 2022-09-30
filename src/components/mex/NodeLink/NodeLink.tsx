import React, { useEffect } from 'react'

import { SharedNodeIcon } from '@components/icons/Icons'
import { useNodes } from '@hooks/useNodes'
import useMultipleEditors from '@store/useEditorsStore'

import { tinykeys } from '@workduck-io/tinykeys'

import EditorPreview from '../../../editor/Components/EditorPreview/EditorPreview'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { NodeType } from '../../../types/Types'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import { NodeLinkStyled, NodeLinkTitleWrapper, NodeLinkWrapper } from '../Backlinks/Backlinks.style'

interface NodeLinkProps {
  keyStr: string
  nodeid: string

  // Show preview (default true)
  preview?: boolean
  icon?: boolean

  /**
   * Replace the default onclick action on node link
   */
  onClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void

  /**
   * RenderActions
   */
  RenderActions?: () => JSX.Element
}

const NodeLink = ({ nodeid, preview = true, icon, keyStr, onClick, RenderActions }: NodeLinkProps) => {
  const [visible, setVisible] = React.useState(false)
  const isEditorPresent = useMultipleEditors((store) => store.editors)?.[nodeid]
  const { getPathFromNodeid } = useLinks()
  const { getNodeType } = useNodes()
  const { goTo } = useRouting()
  const { push } = useNavigation()

  const addPreviewInEditors = useMultipleEditors((store) => store.addEditor)
  const nodeType = getNodeType(nodeid)

  const onClickProps = (ev) => {
    // Show preview on click, if preview is shown, navigate to link
    ev.preventDefault()
    ev.stopPropagation()

    if (ev.detail === 2) {
      if (onClick) {
        onClick(ev)
      } else {
        push(nodeid)
        goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
      }
    }

    addPreviewInEditors(nodeid)

    if (!visible) {
      setVisible(true)
    }
  }

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
  }

  return (
    <EditorPreview
      key={keyStr}
      preview={visible}
      label={nodeid}
      setPreview={setVisible}
      allowClosePreview={!isEditorPresent}
      hover
      nodeid={nodeid}
      placement="auto-start"
    >
      <NodeLinkWrapper onClick={onClickProps}>
        <NodeLinkStyled selected={!!isEditorPresent} key={`NodeLink_${keyStr}`}>
          <NodeLinkTitleWrapper>
            {nodeType === NodeType.SHARED && <SharedNodeIcon />}
            {getPathFromNodeid(nodeid, true)}
          </NodeLinkTitleWrapper>
          {RenderActions && <RenderActions />}
        </NodeLinkStyled>
      </NodeLinkWrapper>
    </EditorPreview>
  )
}

export default NodeLink
