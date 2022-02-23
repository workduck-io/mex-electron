import { useEditorRef } from '@udecode/plate'
import * as React from 'react'
import { Transforms } from 'slate'
import { useFocused, useSelected } from 'slate-react'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../../views/routes/urls'
import { useHotkeys } from '../hooks/useHotkeys'
import { useOnMouseClick } from '../hooks/useOnMouseClick'
import { STag, STagRoot } from './TagElement.styles'
import { TagElementProps } from './TagElement.types'

/**
 * TagElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */
export const TagElement = ({ attributes, children, element }: TagElementProps) => {
  const editor = useEditorRef()
  const selected = useSelected()
  const focused = useFocused()
  const { goTo } = useRouting()

  const onClickProps = useOnMouseClick(() => {
    openTag(element.value)
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

  const openTag = (tag: string) => {
    goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }

  return (
    <STagRoot {...attributes} data-slate-value={element.value} contentEditable={false}>
      <STag {...onClickProps} selected={selected}>
        #{element.value}
      </STag>
      {children}
    </STagRoot>
  )
}
