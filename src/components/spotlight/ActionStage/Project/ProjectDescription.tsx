import React from 'react'
import { TemplateEntity } from '@workduck-io/action-request-helper'
import styled, { css } from 'styled-components'
import MarkDown from 'react-markdown'

export type TemplateItemProp = { item: TemplateEntity; isView?: boolean }

export const TemplateCss = css`
  margin: 0 0.25rem;
`

const DescContainer = styled.span<{ isView: boolean }>`
  ${TemplateCss}
  overflow-y: auto;

  ${({ isView }) =>
    isView &&
    css`
      font-size: 0.9rem;
      color: ${({ theme }) => theme.colors.text.default};
      margin: 0 0.5rem;

      strong {
        font-weight: bold;
      }
    `}
`

const ProjectDescription: React.FC<TemplateItemProp> = ({ item, isView }) => {
  if (!isView) return <></>

  return (
    <DescContainer isView={isView}>
      {item.value && <MarkDown linkTarget="_blank">{item.value?.toString()}</MarkDown>}
    </DescContainer>
  )
}

export default ProjectDescription
