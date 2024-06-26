import fileList3Line from '@iconify/icons-ri/file-list-3-line'
import headingIcon from '@iconify/icons-ri/heading'
import listOrdered from '@iconify/icons-ri/list-ordered'
import listUnordered from '@iconify/icons-ri/list-unordered'
import taskLine from '@iconify/icons-ri/task-line'
import { Icon } from '@iconify/react'
import { ELEMENT_OL, ELEMENT_UL } from '@udecode/plate'
import { ManagedOpenState } from '@ui/sidebar/Sidebar.types'
import React from 'react'
import { OutlineHelp } from '../../../data/Defaults/helpText'
import { ELEMENTS_IN_OUTLINE } from '../../../data/outline'
import { useBlockHighlightStore, useFocusBlock } from '../../../editor/Actions/useFocusBlock'
import { ELEMENT_TODO_LI } from '../../../editor/Components/Todo/createTodoPlugin'
import { useAnalysisStore } from '../../../store/useAnalysis'
import { InfoWidgetWrapper } from '../../../style/infobar'
import { Note } from '../../../style/Typography'
import Collapse from '../../../ui/layout/Collapse/Collapse'
import { OutlineIconWrapper, OutlineItemRender, OutlineItemText, OutlineWrapper } from './Outline.styles'

interface OutlineProps {
  managedOpenState?: ManagedOpenState
}

const Outline = ({ managedOpenState }: OutlineProps) => {
  const outline = useAnalysisStore((state) => state.analysis.outline)

  const { selectBlock } = useFocusBlock()
  const setHighlights = useBlockHighlightStore((state) => state.setHighlightedBlockIds)

  return (
    <InfoWidgetWrapper>
      <Collapse
        maximumHeight="40vh"
        defaultOpen
        icon={fileList3Line}
        title="Outline"
        managedOpenState={managedOpenState}
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
                  onClick={(e) => {
                    e.preventDefault()
                    selectBlock(outlineItem.id)
                    setHighlights([outlineItem.id], 'editor')
                  }}
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
