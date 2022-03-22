import styled from 'styled-components'
import { TemplateCss, TemplateItemProp } from './ProjectTitle'
import React from 'react'

const ProjectLabelsStyled = styled.div<{ isView?: boolean }>`
  ${TemplateCss};

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`

const Label = styled.span<{ color: string }>``

const ProjectLabels: React.FC<TemplateItemProp> = ({ item, isView }) => {
  // if (isView) return <ProjectLabelsStyled isView={isView}>{Array.isArray(item.)}</ProjectLabelsStyled>

  return <></>
}

export default ProjectLabels
