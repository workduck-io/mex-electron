import styled from 'styled-components'
import { TemplateCss, TemplateItemProp } from './ProjectTitle'
import React from 'react'
import { FieldLabel } from './ProjectIcon'
import { transparentize } from 'polished'

const ProjectLabelsStyled = styled.div<{ isView?: boolean }>`
  ${TemplateCss};
  margin: 0.25rem 0;
  section {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }
`

const Label = styled.span<{ color?: string }>`
  font-size: 0.8rem;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  padding: ${({ theme }) => theme.spacing.tiny};
  margin: ${({ theme }) => theme.spacing.tiny};
  color: ${({ color, theme }) => (color ? color : theme.colors.text.default)};
  background: ${({ color, theme }) => transparentize(0.4, color ? color : theme.colors.gray[5])};
`

const ProjectLabels: React.FC<TemplateItemProp> = ({ item, isView }) => {
  if (!item.value || !Array.isArray(item.value)) return <></>

  if (isView)
    return (
      <ProjectLabelsStyled isView={isView}>
        <FieldLabel>{item.key}</FieldLabel>
        <section>
          {item.value.map((label: any) => {
            if (typeof label === 'string') {
              return <Label key={label}>{label}</Label>
            }

            return (
              <Label key={label.label_name} color={label.label_color}>
                {label.label_name}
              </Label>
            )
          })}
        </section>
      </ProjectLabelsStyled>
    )

  return <></>
}

export default ProjectLabels
