import * as React from 'react'

import { useNoteContext } from '@store/Context/context.note'
import { useSpotlightContext } from '@store/Context/context.spotlight'
import { moveSelection, useEditorRef } from '@udecode/plate'
import { openTagInMex } from '@utils/combineSources'
import { useFocused, useSelected } from 'slate-react'

import { tinykeys } from '@workduck-io/tinykeys'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../../../views/routes/urls'
import { useOnMouseClick } from '../hooks/useOnMouseClick'
import { STag, STagRoot } from './TagElement.styles'
import { TagElementProps } from './TagElement.types'

/**
 * TagElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */
export const TagElement = ({ attributes, children, element }: TagElementProps) => {
  const spotlightCtx = useSpotlightContext()
  const noteCtx = useNoteContext()
  const editor = useEditorRef()
  const selected = useSelected()
  const focused = useFocused()
  const { goTo } = useRouting()

  const onClickProps = useOnMouseClick(() => {
    openTag(element.value)
  })

  React.useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Backspace: (event) => {
        if (selected && focused && editor.selection) {
          moveSelection(editor)
        }
      },
      Delete: (ev) => {
        if (selected && focused && editor.selection) {
          moveSelection(editor, { reverse: true })
        }
      }
    })

    return () => unsubscribe()
  }, [selected, focused])

  const openTag = (tag: string) => {
    if (noteCtx) {
      openTagInMex(tag)
    } else if (!spotlightCtx) {
      goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
    }
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
