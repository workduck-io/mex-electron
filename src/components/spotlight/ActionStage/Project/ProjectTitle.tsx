import React from 'react'
import { TemplateEntity } from '@workduck-io/action-request-helper'
import styled, { css } from 'styled-components'

export type TemplateItemProp = { item: TemplateEntity; isView?: boolean }

export const TemplateCss = css`
  margin: 0 0.25rem;
  color: ${({ theme }) => theme.colors.text.default};
`

const Title = styled.span<{ isView: boolean }>`
  ${TemplateCss}

  ${({ isView }) =>
    isView
      ? css`
          font-size: 1.5rem;
          margin: 0.5rem;
        `
      : css`
          flex: 1;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
        `}
`

const ProjectTitle: React.FC<TemplateItemProp> = ({ item, isView }) => {
  return <Title isView={isView}>{item.value}</Title>
}

export default ProjectTitle
