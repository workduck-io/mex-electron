import React from 'react'

import { transparentize } from 'polished'
import styled, { css } from 'styled-components'

import { TemplateEntity } from '@workduck-io/action-request-helper'

import { FieldLabel } from './ProjectIcon'

export type TemplateItemProp = { item: TemplateEntity; isView?: boolean }

export const TemplateCss = css`
  margin: 0 0.25rem;
  color: ${({ theme }) => theme.colors.text.default};
`

const ProjectInfoStyled = styled.span<{ isView?: boolean }>`
  ${TemplateCss};

  ${(props) =>
    props.isView &&
    css`
      margin: 0.5rem 0;
    `}
`

const Info = styled.span<{ isView?: boolean }>`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.default};

  ${(props) =>
    !props.isView &&
    css`
      display: flex;
      align-items: center;
      color: ${({ theme }) => theme.colors.text.fade};
      font-size: 0.65rem;
      padding: ${({ theme }) => theme.spacing.tiny};
      border-radius: ${({ theme }) => theme.borderRadius.tiny};
      border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.primary)};
    `}
`

const ProjectInfo: React.FC<TemplateItemProp> = ({ item, isView }) => {
  if (!item.value) return <></>

  if (isView)
    return (
      <ProjectInfoStyled isView={isView}>
        <FieldLabel>{item.key}</FieldLabel>
        <Info isView={isView}>{item.value as any}</Info>
      </ProjectInfoStyled>
    )

  return (
    <ProjectInfoStyled isView={isView}>
      <Info isView={isView}>{item.value as any}</Info>
    </ProjectInfoStyled>
  )
}

export default ProjectInfo
