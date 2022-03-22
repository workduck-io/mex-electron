import React from 'react'
import ProjectIcon from './ProjectIcon'
import ProjectTime from './ProjectTime'
import ProjectTitle from './ProjectTitle'
import { TemplateEntity } from '@workduck-io/action-request-helper'
import ProjectDescription from './ProjectDescription'
import ProjectLabels from './ProjectLabels'

export enum ProjectElementType {
  'url' = 'url',
  'title' = 'title',
  'labels' = 'labels',
  'icon' = 'icon',
  'desc' = 'desc',
  'timestamp' = 'timestamp'
}

type ProjectType = {
  type: ProjectElementType
  item: TemplateEntity
  isView?: boolean
}

const Project: React.FC<ProjectType> = ({ type, item, isView }) => {
  switch (type) {
    case ProjectElementType.title:
      return <ProjectTitle item={item} isView={isView} />
    case ProjectElementType.timestamp:
      return <ProjectTime item={item} isView={isView} />
    case ProjectElementType.labels:
      return <ProjectLabels item={item} isView={isView} />
    case ProjectElementType.icon:
      return <ProjectIcon item={item} isView={isView} />
    case ProjectElementType.desc:
      return <ProjectDescription item={item} isView={isView} />
    default:
      return null
  }
}

export default Project
