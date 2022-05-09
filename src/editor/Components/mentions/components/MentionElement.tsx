import { useEditorRef } from '@udecode/plate'
import React, { useMemo } from 'react'
import { Transforms } from 'slate'
import { useFocused, useSelected } from 'slate-react'
import { useHotkeys } from '../../tag/hooks/useHotkeys'
import { useOnMouseClick } from '../../tag/hooks/useOnMouseClick'
import { SMention, SMentionRoot } from './MentionElement.styles'
import { MentionElementProps } from './MentionElement.types'
import { mog } from '@utils/lib/helper'
import { useMentions } from '@hooks/useMentions'

/**
 * MentionElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */
export const MentionElement = ({ attributes, children, element }: MentionElementProps) => {
  const editor = useEditorRef()
  const selected = useSelected()
  const focused = useFocused()
  const { getUsernameFromUserid } = useMentions()

  const onClickProps = useOnMouseClick(() => {
    mog('Mention has been clicked yo', { val: element.value })
    // openTag(element.value)
  })

  const username = useMemo(() => getUsernameFromUserid(element.value), [element.value])

  useHotkeys(
    'backspace',
    () => {
      if (selected && focused && editor.selection) {
        Transforms.move(editor)
      }
    },
    [selected, focused]
  )

  useHotkeys(
    'delete',
    () => {
      if (selected && focused && editor.selection) {
        // mog('delete', { selected, focused, sel: editor.selection })
        Transforms.move(editor, { reverse: true })
      }
    },
    [selected, focused]
  )

  return (
    <SMentionRoot {...attributes} data-slate-value={element.value} contentEditable={false}>
      <SMention {...onClickProps} selected={selected}>
        @{username ?? element.value}
      </SMention>
      {children}
    </SMentionRoot>
  )
}
