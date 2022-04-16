import React from 'react'
import ProjectIcon from './ProjectIcon'
import ProjectTime from './ProjectTime'
import ProjectTitle from './ProjectTitle'
import { TemplateEntity, TemplateEntityType } from '@workduck-io/action-request-helper'
import ProjectDescription from './ProjectDescription'
import ProjectLabels from './ProjectLabels'

type ProjectType = {
  type: TemplateEntityType
  item: TemplateEntity
  isView?: boolean
}

const Project: React.FC<ProjectType> = ({ type, item, isView }) => {
  switch (type) {
    case 'title':
      return <ProjectTitle item={item} isView={isView} />
    case 'timestamp':
      return <ProjectTime item={item} isView={isView} />
    case 'labels':
      return <ProjectLabels item={item} isView={isView} />
    case 'icon':
      return <ProjectIcon item={item} isView={isView} />
    case 'desc':
      return <ProjectDescription item={item} isView={isView} />
    default:
      return null
  }
}

export default Project
