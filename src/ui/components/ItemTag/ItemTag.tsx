import { Icon } from '@iconify/react'
import React from 'react'
import { ToolbarTooltip } from '../../../components/mex/Tooltips'
import { ItemTagWrapper } from './style'

interface ItemTagProps {
  tag: string
  icon: string
  tooltip?: string
  onClick?: () => void
}

const ItemTag = ({ tag, icon, tooltip, onClick }: ItemTagProps) => {
  const tagElement = (
    <ItemTagWrapper onClick={onClick}>
      <Icon icon={icon} />
      {tag}
    </ItemTagWrapper>
  )
  if (tooltip) {
    return (
      <ToolbarTooltip placement="bottom" content={tooltip}>
        {tagElement}
      </ToolbarTooltip>
    )
  } else return tagElement
}

export default ItemTag
