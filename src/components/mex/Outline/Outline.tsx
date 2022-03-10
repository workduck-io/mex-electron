import fileList3Line from '@iconify/icons-ri/file-list-3-line'
import { Icon } from '@iconify/react'
import { findNode, getPlateEditorRef } from '@udecode/plate'
import React from 'react'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { OutlineItem, useAnalysisStore } from '../../../store/useAnalysis'
import { InfoWidgetScroll, InfoWidgetWrapper } from '../../../style/infobar'
import { Note } from '../../../style/Typography'
import { mog } from '../../../utils/lib/helper'
import { DataInfoHeader } from '../Backlinks/Backlinks.style'
import { OutlineItemRender } from './Outline.styles'

const Outline = () => {
  const outline = useAnalysisStore((state) => state.outline)

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

  // useEffect(() => {
  //   console.log('Outline updated', outline)
  // }, [outline])

  return (
    <InfoWidgetWrapper>
      <DataInfoHeader>
        <Icon icon={fileList3Line}></Icon>
        Outline
      </DataInfoHeader>
      <InfoWidgetScroll>
        {outline.length > 0 ? (
          outline.map((heading) => (
            <OutlineItemRender
              key={`OutlineItemFor_${heading.id}`}
              onClick={(e) => onSelectHeading(heading, e)}
              level={heading.level}
            >
              {heading.title}
            </OutlineItemRender>
          ))
        ) : (
          <>
            <Note>No Outline found.</Note>
            <Note>Create headings with h1, h2, h3 etc to generate outline.</Note>
          </>
        )}
      </InfoWidgetScroll>
    </InfoWidgetWrapper>
  )
}

export default Outline
