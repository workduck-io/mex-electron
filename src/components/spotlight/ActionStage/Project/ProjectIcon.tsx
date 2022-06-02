import { isUrl } from '@udecode/plate'
import React, { forwardRef } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { MexIcon } from '../../../../style/Layouts'
import Tippy from '@tippyjs/react'
import { TemplateCss, TemplateItemProp } from './ProjectTitle'

export const FieldLabel = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: 0.8rem;
  color: ${(props) => props.theme.colors.text.fade};
`

export const FieldValue = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
  color: ${(props) => props.theme.colors.text.default};
  font-size: 0.9rem;
  span {
    margin-left: 0.25rem;
  }
`

const ProjectIconContainer = styled.span<{ isView: boolean }>`
  ${TemplateCss}
  ${(props) =>
    props.isView
      ? css`
          width: 100%;
          margin: 0.25rem 0;
        `
      : css`
          display: flex;
          align-items: center;
        `}
  
  font-size: 0.9rem;

  img {
    border-radius: 50%;
    padding: 4px;
    background-color: ${({ theme }) => theme.colors.background.card};
  }
`

export const DEFAULT_IMAGE_URL = 'https://www.gravatar.com/avatar/?r=g&d=identicon'

export const ProjectIconMex: React.FC<{
  isMex?: boolean
  margin?: string
  icon: string
  size?: number
  color?: string
}> = forwardRef((props, ref) => {
  const theme = useTheme()
  // eslint-disable-next-line react/prop-types
  const { isMex, icon, size, color, margin } = props

  if (isMex)
    return (
      <MexIcon
        ref={ref as any}
        icon={icon}
        noHover
        margin={margin}
        height={size ?? 20}
        width={size ?? 20}
        color={color ?? theme.colors.primary}
      />
    )

  return (
    <img
      ref={ref as any}
      onError={(e) => {
        e.currentTarget.onerror = null
        e.currentTarget.src = DEFAULT_IMAGE_URL
      }}
      style={{ margin: margin ?? '0' }}
      src={icon}
      height={size ? size : 24}
      width={size ? size : 24}
    />
  )
})

ProjectIconMex.displayName = 'ProjectIconMex'

export const getIconType = (icon: string): { mexIcon: boolean; isIconfiy: boolean } => {
  const mexIcon = !isUrl(icon)

  const isIconfiy = mexIcon && icon.includes(':')

  return {
    mexIcon,
    isIconfiy
  }
}

const ProjectIcon: React.FC<TemplateItemProp> = ({ item, isView }) => {
  if (!item.icon) return <></>

  const { isIconfiy, mexIcon } = getIconType(item.icon)

  if (!isIconfiy && mexIcon) return null

  if (!isView) {
    const tooltip = `${item.key}: ${item.value}`

    return (
      <ProjectIconContainer isView={isView}>
        <Tippy
          delay={100}
          interactiveDebounce={100}
          placement="bottom"
          appendTo={() => document.body}
          theme="mex"
          content={tooltip}
        >
          <ProjectIconMex icon={item.icon} isMex={mexIcon} />
        </Tippy>
      </ProjectIconContainer>
    )
  }

  return (
    <ProjectIconContainer isView={isView}>
      <FieldLabel>{item.key}</FieldLabel>
      <FieldValue>
        <ProjectIconMex isMex={mexIcon} icon={item.icon} />
        <span>{item.value}</span>
      </FieldValue>
    </ProjectIconContainer>
  )
}

export default ProjectIcon
