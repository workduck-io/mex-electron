import React from 'react'
import { DEFAULT_LIST_ITEM_ICON } from '@components/spotlight/ActionStage/ActionMenu/ListSelector'
import { getIconType, ProjectIconMex } from '@components/spotlight/ActionStage/Project/ProjectIcon'

export type IconProps = {
  icon: string
  size: number
  margin?: string
  color?: string
}

const Icon: React.FC<IconProps> = (props) => {
  const { mexIcon } = getIconType(props.icon || DEFAULT_LIST_ITEM_ICON)

  return <ProjectIconMex isMex={mexIcon} {...props} />
}

export default Icon
