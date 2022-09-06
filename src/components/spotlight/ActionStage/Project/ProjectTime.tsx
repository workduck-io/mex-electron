import React from 'react'
import styled, { css } from 'styled-components'
import { Relative, RelativeTime } from '../../../mex/RelativeTime'
import { FieldLabel, FieldValue } from './ProjectIcon'
import { TemplateCss, TemplateItemProp } from './ProjectTitle'

export const ProjectTimeStyled = styled.div<{ isView?: boolean }>`
  ${TemplateCss}

  color: ${({ theme }) => theme.colors.gray[5]};
  ${(props) =>
    props.isView &&
    css`
      width: 100%;
      margin: 0.5rem 0;
    `}

  ${Relative} {
    font-size: 0.8rem;
  }
`

const ProjectTime: React.FC<TemplateItemProp> = ({ item, isView }) => {
  if (!item.value) return <></>
  if (isNaN(+item.value)) return <></>

  if (isView)
    return (
      <ProjectTimeStyled isView={isView}>
        <FieldLabel>{item.key}</FieldLabel>
        <FieldValue>
          <span>{<RelativeTime dateNum={item.value as any} />}</span>
        </FieldValue>
      </ProjectTimeStyled>
    )

  return <ProjectTimeStyled>{<RelativeTime prefix={item.key} dateNum={item.value as any} />}</ProjectTimeStyled>
}

export default ProjectTime
