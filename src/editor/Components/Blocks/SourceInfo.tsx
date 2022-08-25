import React from 'react'
import { SourceInfoWrapper, StyledSource } from './styled'
import Tippy from '@tippyjs/react'
import {
  getIconType,
  ProjectIconContainer,
  ProjectIconMex
} from '@components/spotlight/ActionStage/Project/ProjectIcon'
import { useEditorStore } from '@store/useEditorStore'

// * Get Favicon url
const getFavicon = (source: string) => {
  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${source}&size=32`
}

const Source: React.FC<{ source: string }> = ({ source }) => {
  const isUserEditing = useEditorStore((store) => store.isEditing)
  const icon = getFavicon(source)

  const onClick = () => {
    window.open(source, '_blank')
  }

  return (
    <StyledSource isVisible={!isUserEditing} contentEditable={false} onClick={onClick}>
      <ProjectIconContainer isView={false}>
        <Tippy
          delay={100}
          interactiveDebounce={100}
          placement="top"
          appendTo={() => document.body}
          theme="mex-bright"
          content={source}
        >
          <ProjectIconMex icon={icon} isMex={false} size={20} />
        </Tippy>
      </ProjectIconContainer>
    </StyledSource>
  )
}

const SourceInfo = (props: any) => {
  const { children, element, attributes } = props

  if (element?.blockMeta) {
    const { mexIcon } = getIconType(element?.blockMeta?.source)

    if (!mexIcon)
      return (
        <SourceInfoWrapper {...attributes}>
          <Source source={element?.blockMeta?.source} />
          {children}
        </SourceInfoWrapper>
      )

    return children
  }

  return children
}

export default SourceInfo
