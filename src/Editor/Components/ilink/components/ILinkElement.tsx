import * as React from 'react'
import { useEditorRef } from '@udecode/plate'
import { Transforms } from 'slate'
import { useFocused, useSelected } from 'slate-react'
import { useHotkeys } from '../hooks/useHotkeys'
import { useOnMouseClick } from '../hooks/useOnMouseClick'
import { SILink, SILinkRoot } from './ILinkElement.styles'
import { ILinkElementProps } from './ILinkElement.types'
import { useEditorStore } from '../../../Store/EditorStore'
import { useNavigation } from '../../../../Hooks/useNavigation/useNavigation'

/**
 * ILinkElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */
export const ILinkElement = ({ attributes, children, element }: ILinkElementProps) => {
  const editor = useEditorRef()
  const selected = useSelected()
  const focused = useFocused()
  // const loadNodeFromId = useEditorStore((state) => state.loadNodeFromId)
  const { push } = useNavigation()

  const onClickProps = useOnMouseClick(() => {
    push(element.value)
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
        Transforms.move(editor, { reverse: true })
      }
    },
    [selected, focused]
  )

  return (
    <SILinkRoot {...attributes} id={`ILINK_${element.value}`} data-slate-value={element.value} contentEditable={false}>
      <SILink focused={selected} {...onClickProps}>
        <span className="ILink_decoration ILink_decoration_left">[[</span>
        {element.value}
        <span className="ILink_decoration ILink_decoration_right">]]</span>
      </SILink>
      {children}
    </SILinkRoot>
  )
}
