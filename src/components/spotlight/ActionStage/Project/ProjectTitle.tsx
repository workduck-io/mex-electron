import React from 'react'

import styled, { css } from 'styled-components'

import { TemplateEntity } from '@workduck-io/action-request-helper'

export type TemplateItemProp = { item: TemplateEntity; isView?: boolean }

export const TemplateCss = css`
  margin: 0 0.25rem;
  color: ${({ theme }) => theme.colors.text.default};
  user-select: none;
`

const Title = styled.span<{ isView: boolean }>`
  ${TemplateCss}

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ isView }) =>
    isView
      ? css`
          max-width: 100%;
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
  return <Title isView={isView}>{item.value as any}</Title>
}

export default ProjectTitle
