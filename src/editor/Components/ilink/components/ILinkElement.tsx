import { useReadOnly, useFocused, useSelected } from 'slate-react'
import shareForwardLine from '@iconify/icons-ri/share-forward-line'
import archivedIcon from '@iconify/icons-ri/archive-line'
import eyeOffLine from '@iconify/icons-ri/eye-off-line'
import { Icon } from '@iconify/react'
import { useEditorRef } from '@udecode/plate'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Transforms } from 'slate'
import styled from 'styled-components'
import useArchive from '../../../../hooks/useArchive'
import { useLinks } from '../../../../hooks/useLinks'
import { useNavigation } from '../../../../hooks/useNavigation'
import { useNodes } from '../../../../hooks/useNodes'
import EditorPreview from '../../EditorPreview/EditorPreview'
import { useHotkeys } from '../hooks/useHotkeys'
import { useOnMouseClick } from '../hooks/useOnMouseClick'
import { SILink, SILinkRoot, StyledIcon } from './ILinkElement.styles'
import { ILinkElementProps } from './ILinkElement.types'
import { mog } from '../../../../utils/lib/helper'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../../views/routes/urls'
import { convertContentToRawText, getBlock } from '../../../../utils/search/parseData'
import { ILink, NodeType, SharedNode } from '../../../../types/Types'
import { SharedNodeIcon } from '@components/icons/Icons'

/**
 * ILinkElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */

const SharedNodeLink = ({ selected, sharedNode }: { selected: boolean; sharedNode: SharedNode }) => {
  return (
    <SILink selected={selected}>
      <StyledIcon icon={shareForwardLine} />
      <span className="ILink_decoration ILink_decoration_left">[[</span>
      <span className="ILink_decoration ILink_decoration_value"> {sharedNode?.path}</span>
      <span className="ILink_decoration ILink_decoration_right">]]</span>
    </SILink>
  )
}

const ArchivedNode = ({ selected, archivedNode }: { selected: boolean; archivedNode: ILink }) => {
  return (
    <SILink selected={selected} color="#df7777" archived={true}>
      <SharedNodeIcon />
      <span className="ILink_decoration ILink_decoration_left">[[</span>
      <span className="ILink_decoration ILink_decoration_value"> {archivedNode?.path}</span>
      <span className="ILink_decoration ILink_decoration_right">]]</span>
    </SILink>
  )
}

const MissingNode = ({ selected }: { selected: boolean }) => {
  return (
    <SILink selected={selected}>
      <StyledIcon icon={eyeOffLine} />
      <span className="ILink_decoration ILink_decoration_left">[[</span>
      <span className="ILink_decoration ILink_decoration_value">Private/Missing</span>
      <span className="ILink_decoration ILink_decoration_right">]]</span>
    </SILink>
  )
}
export const ILinkElement = ({ attributes, children, element }: ILinkElementProps) => {
  const editor = useEditorRef()
  const selected = useSelected()
  const focused = useFocused()
  const [preview, setPreview] = useState(false)
  const { push } = useNavigation()
  const { getPathFromNodeid } = useLinks()
  const { getArchiveNode, getSharedNode, getNodeType } = useNodes()
  // mog('We reached here', { selected, focused })

  // const nodeid = getNodeidFromPath(element.value)
  const readOnly = useReadOnly()
  const path = getPathFromNodeid(element.value)
  const { goTo } = useRouting()

  const onClickProps = useOnMouseClick(() => {
    // Show preview on click, if preview is shown, navigate to link
    if (!preview) setPreview(true)
    else {
      push(element.value)
      goTo(ROUTE_PATHS.node, NavigationType.push, element.value)
    }
  })

  useEffect(() => {
    // If the preview is shown and the element losses focus --> Editor focus is moved
    // Hide the preview
    if (preview && !selected) setPreview(false)
  }, [selected])

  useHotkeys(
    'backspace',
    () => {
      if (selected && focused && editor.selection) {
        Transforms.move(editor)
      }
    },
    [element]
  )

  useHotkeys(
    'enter',
    () => {
      // mog('Enter the dragon', { selected, preview, focused, esl: editor.selection })
      // Show preview on Enter, if preview is shown, navigate to link
      if (selected && focused && editor.selection) {
        if (!preview) setPreview(true)
      }
      // Once preview is shown the link looses focus
      if (preview) {
        // mog('working', { element })
        push(element.value)
        goTo(ROUTE_PATHS.node, NavigationType.push, element.value)
      }
    },
    [selected, preview]
  )
  useHotkeys(
    'delete',
    () => {
      if (selected && focused && editor.selection) {
        Transforms.move(editor, { reverse: true })
      }
    },
    [selected, focused]
  )
  const nodeType = getNodeType(element.value)
  const block = element.blockId ? getBlock(element.value, element.blockId) : undefined
  const content = block ? [block] : undefined
  const archivedNode = nodeType === NodeType.ARCHIVED ? getArchiveNode(element.value) : undefined
  const sharedNode = nodeType === NodeType.SHARED ? getSharedNode(element.value) : undefined

  return (
    <SILinkRoot
      {...attributes}
      id={`ILINK_${element.value}`}
      data-tour="mex-onboarding-ilink"
      data-slate-value={element.value}
      contentEditable={false}
    >
      {
        // The key to the temporary object defines what to render
        {
          [NodeType.SHARED]: <SharedNodeLink selected={selected} sharedNode={sharedNode} />,
          [NodeType.ARCHIVED]: <ArchivedNode selected={selected} archivedNode={archivedNode} />,
          [NodeType.DEFAULT]: (
            <EditorPreview
              placement="auto"
              allowClosePreview={readOnly}
              preview={preview}
              nodeid={element.value}
              content={content}
              closePreview={() => setPreview(false)}
            >
              <SILink selected={selected} {...onClickProps}>
                <span className="ILink_decoration ILink_decoration_left">[[</span>
                <span className="ILink_decoration ILink_decoration_value">
                  {' '}
                  {!content ? path : `${path} : ${element.blockValue}`}{' '}
                </span>
                <span className="ILink_decoration ILink_decoration_right">]]</span>
              </SILink>
            </EditorPreview>
          ),
          [NodeType.MISSING]: <MissingNode selected={selected} />
        }[nodeType]
      }
      {children}
    </SILinkRoot>
  )
}

const isPreview = (id: string) => id?.startsWith('__preview__')
