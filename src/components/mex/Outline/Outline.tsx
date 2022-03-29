import listOrdered from '@iconify/icons-ri/list-ordered'
import taskLine from '@iconify/icons-ri/task-line'
import listUnordered from '@iconify/icons-ri/list-unordered'
import headingIcon from '@iconify/icons-ri/heading'
import fileList3Line from '@iconify/icons-ri/file-list-3-line'
import { Icon } from '@iconify/react'
import { ELEMENT_OL, ELEMENT_UL, findNode, getPlateEditorRef } from '@udecode/plate'
import React from 'react'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { ELEMENTS_IN_OUTLINE } from '../../../data/outline'
import { OutlineItem, useAnalysisStore } from '../../../store/useAnalysis'
import { InfoWidgetScroll, InfoWidgetWrapper } from '../../../style/infobar'
import { Note } from '../../../style/Typography'
import Collapse from '../../../ui/layout/Collapse/Collapse'
import { mog } from '../../../utils/lib/helper'
import { DataInfoHeader } from '../Backlinks/Backlinks.style'
import { OutlineIconWrapper, OutlineItemRender, OutlineItemText, OutlineWrapper } from './Outline.styles'
import { ELEMENT_TODO_LI } from '../../../editor/Components/Todo/createTodoPlugin'
import { OutlineHelp } from '../../../data/Defaults/helpText'

const Outline = () => {
  const outline = useAnalysisStore((state) => state.analysis.outline)

  const onSelectHeading = (heading: OutlineItem, e: React.MouseEvent) => {
    e.preventDefault()
    const editor = getPlateEditorRef()
    if (editor) {
      const headingNode = findNode(editor, {
        at: [],
        match: (n) => {
          console.log('n', n)
          return n.id === heading.id
        },
        mode: 'all'
      })
      // console.log('select heading', { heading, headingNode, e })
      if (!headingNode) return
      const headingNodePath = headingNode[1]

      if (!headingNodePath) return

      Transforms.select(editor, Editor.start(editor, headingNodePath))
      ReactEditor.focus(editor)
      mog('select heading', { heading, headingNode, headingNodePath })
    }
  }

  return (
    <InfoWidgetWrapper>
      <Collapse
        maximumHeight="40vh"
        defaultOpen
        icon={fileList3Line}
        title="Outline"
        infoProps={{
          text: OutlineHelp
        }}
      >
        {outline.length > 0 ? (
          <OutlineWrapper>
            {outline.map((outlineItem) => {
              const icon = getOutlineIcon(outlineItem.type)
              const isHeading = ELEMENTS_IN_OUTLINE.includes(outlineItem.type.toLowerCase())
              return (
                <OutlineItemRender
                  key={`OutlineItemFor_${outlineItem.id}`}
                  onClick={(e) => onSelectHeading(outlineItem, e)}
                  level={outlineItem.level}
                  heading={isHeading}
                >
                  <OutlineIconWrapper>
                    {isHeading ? outlineItem.type.toUpperCase() : <Icon icon={icon} />}
                  </OutlineIconWrapper>
                  <OutlineItemText level={outlineItem.level} heading={isHeading}>
                    {outlineItem.title}
                  </OutlineItemText>
                </OutlineItemRender>
              )
            })}
          </OutlineWrapper>
        ) : (
          <>
            <Note>No Outline found.</Note>
            <Note>Create headings with h1, h2, h3 etc to generate outline.</Note>
          </>
        )}
      </Collapse>
    </InfoWidgetWrapper>
  )
}

const getOutlineIcon = (type: string) => {
  if (ELEMENTS_IN_OUTLINE.includes(type.toLowerCase())) {
    return headingIcon
  }

  if (type === ELEMENT_TODO_LI) {
    return taskLine
  }

  if (type === ELEMENT_OL) {
    return listOrdered
  }

  if (type === ELEMENT_UL) {
    return listUnordered
  }
}

export default Outline
