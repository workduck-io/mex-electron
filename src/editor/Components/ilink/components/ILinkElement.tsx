import { mog } from '../../../../utils/lib/helper'
import archivedIcon from '@iconify-icons/ri/archive-line'
import { Icon } from '@iconify/react'
import { insertNodes, useEditorRef } from '@udecode/plate'
import * as React from 'react'
import { Editor, Transforms } from 'slate'
import { useFocused, useSelected } from 'slate-react'
import styled from 'styled-components'
import useArchive from '../../../../hooks/useArchive'
import { useLinks } from '../../../../hooks/useLinks'
import { useNavigation } from '../../../../hooks/useNavigation'
import EditorPreview from '../../EditorPreview/EditorPreview'
import { useHotkeys } from '../hooks/useHotkeys'
import { useOnMouseClick } from '../hooks/useOnMouseClick'
import { SILink, SILinkRoot } from './ILinkElement.styles'
import { ILinkElementProps } from './ILinkElement.types'
import { ELEMENT_ILINK } from '../defaults'
import { useEffect, useState } from 'react'

/**
 * ILinkElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */

const StyledIcon = styled(Icon)`
  margin-right: 4px;
`
export const ILinkElement = ({ attributes, children, element }: ILinkElementProps) => {
  const editor = useEditorRef()
  const selected = useSelected()
  const focused = useFocused()
  const [preview, setPreview] = useState(false)
  const { push } = useNavigation()
  const { getUidFromNodeId, getNodeIdFromUid } = useLinks()
  // mog('We reached here', { selected, focused })

  // const nodeid = getUidFromNodeId(element.value)
  const path = getNodeIdFromUid(element.value)
  const { archived } = useArchive()

  const onClickProps = useOnMouseClick(() => {
    if (!preview) setPreview(true)
    else push(element.value)
  })

  useEffect(() => {
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
      if (selected && focused && editor.selection) {
        if (!preview) setPreview(true)
      }
      if (preview) push(element.value)
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

  return (
    <SILinkRoot
      {...attributes}
      id={`ILINK_${element.value}`}
      data-tour="mex-onboarding-ilink"
      data-slate-value={element.value}
      contentEditable={false}
    >
      {archived(element.value) ? (
        <SILink selected={selected} archived={true}>
          <StyledIcon icon={archivedIcon} color="#df7777" />
          <span className="ILink_decoration ILink_decoration_left">[[</span>
          <span className="ILink_decoration ILink_decoration_value"> {element.value}</span>
          <span className="ILink_decoration ILink_decoration_right">]]</span>
        </SILink>
      ) : (
        <EditorPreview isPreview={isPreview(editor.id)} preview={preview} previewRef={editor} nodeid={element.value}>
          <SILink selected={selected} {...onClickProps}>
            <span className="ILink_decoration ILink_decoration_left">[[</span>
            <span className="ILink_decoration ILink_decoration_value"> {path}</span>
            <span className="ILink_decoration ILink_decoration_right">]]</span>
          </SILink>
        </EditorPreview>
      )}
      {children}
    </SILinkRoot>
  )
}

const isPreview = (id: string) => id.startsWith('__preview__')
