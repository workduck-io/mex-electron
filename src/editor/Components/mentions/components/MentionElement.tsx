import { useEditorRef } from '@udecode/plate'
import * as React from 'react'
import { Transforms } from 'slate'
import { useFocused, useSelected } from 'slate-react'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../../views/routes/urls'
import { useHotkeys } from '../../tag/hooks/useHotkeys'
import { useOnMouseClick } from '../../tag/hooks/useOnMouseClick'
import { SMention, SMentionRoot } from './MentionElement.styles'
import { MentionElementProps } from './MentionElement.types'
import { mog } from '@utils/lib/helper'

/**
 * MentionElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */
export const MentionElement = ({ attributes, children, element }: MentionElementProps) => {
  const editor = useEditorRef()
  const selected = useSelected()
  const focused = useFocused()
  const { goTo } = useRouting()

  const onClickProps = useOnMouseClick(() => {
    mog('Mention has been clicked yo', { val: element.value })
    // openTag(element.value)
  })

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
        @{element.value}
      </SMention>
      {children}
    </SMentionRoot>
  )
}
