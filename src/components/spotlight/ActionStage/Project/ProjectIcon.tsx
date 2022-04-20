import { isUrl } from '@udecode/plate'
import React from 'react'
import styled, { css, useTheme } from 'styled-components'
import { MexIcon } from '../../../../style/Layouts'
import Tippy from '@tippyjs/react'
import { TemplateCss, TemplateItemProp } from './ProjectTitle'
import { mog } from '../../../../utils/lib/helper'

export const FieldLabel = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: smaller;
  color: ${(props) => props.theme.colors.text.fade};
`

export const FieldValue = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
  color: ${(props) => props.theme.colors.text.default};
  span {
    margin-left: 0.25rem;
  }
`

const ProjectIconContainer = styled.span<{ isView: boolean }>`
  ${TemplateCss}
  ${(props) =>
    props.isView &&
    css`
      width: 100%;
      margin: 0.25rem 0;
    `}
  
  font-size: 0.9em;

  img {
    border-radius: 50%;
    padding: 4px;
    background-color: ${({ theme }) => theme.colors.background.card};
  }
`

const ProjectIconMex: React.FC<{ isMex: boolean; icon: string }> = ({ isMex, icon }) => {
  const theme = useTheme()

  if (isMex) return <MexIcon icon={icon} fontSize={20} color={theme.colors.primary} />
  return <img src={icon} height={24} width={24} />
}

const ProjectIcon: React.FC<TemplateItemProp> = ({ item, isView }) => {
  if (!item.icon) return <></>

  const mexIcon = !isUrl(item.icon)

  const isIconfiy = mexIcon && item.icon.includes(':')

  if (!isIconfiy && mexIcon) return null

  if (!isView) {
    const tooltip = `${item.key}: ${item.value}`
    mog('TOOLTIP', { tooltip })

    return (
      <ProjectIconContainer isView={isView}>
        <Tippy
          delay={100}
          interactiveDebounce={100}
          placement="bottom"
          appendTo={() => document.body}
          theme="mex"
          content={'SOMETHING IS HERE!'}
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
