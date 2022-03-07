import fileList3Line from '@iconify-icons/ri/file-list-3-line'
import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import { useAnalysis, useAnalysisStore } from '../../../store/useAnalysis'
import { InfoWidgetScroll, InfoWidgetWrapper } from '../../../style/infobar'
import { Note } from '../../../style/Typography'
import { DataInfoHeader } from '../Backlinks/Backlinks.style'
import { OutlineItemRender } from './Outline.styles'

const Outline = () => {
  const outline = useAnalysisStore((state) => state.outline)

  // console.log('LOG_RENDER', outline)
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
            <OutlineItemRender key={`OutlineItemFor_${heading.id}`} level={heading.level}>
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
