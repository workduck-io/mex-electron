import React from 'react'
import { TemplateEntity } from '@workduck-io/action-request-helper'
import styled, { css } from 'styled-components'
import MarkDown from 'react-markdown'

export type TemplateItemProp = { item: TemplateEntity; isView?: boolean }

export const TemplateCss = css`
  margin: 0 0.25rem;
  user-select: none;
`

const DescContainer = styled.span<{ isView: boolean }>`
  ${TemplateCss}
  overflow-y: auto;
  height: 100%;

  ${({ isView }) =>
    isView &&
    css`
      font-size: 0.9rem;
      color: ${({ theme }) => theme.colors.text.default};
      margin: 0 0.5rem;

      img {
        display: block;
        margin-left: auto;
        margin-right: auto;
        border-radius: 5px;
        width: calc(100% - 5px);
      }

      a {
        cursor: pointer;
        color: ${({ theme }) => theme.colors.primary} !important;
        text-decoration: inherit;
      }

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
