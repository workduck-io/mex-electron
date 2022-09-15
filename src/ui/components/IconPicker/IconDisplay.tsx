import { MIcon } from '../../../types/Types'
import React from 'react'
import { Icon } from '@iconify/react'
import { IconWrapper } from './IconPicker.style'

interface IconDisplayProps {
  icon: MIcon
  size?: number
}

const IconDisplay = ({ icon, size }: IconDisplayProps) => {
  return (
    <IconWrapper size={size}>
      {
        {
          EMOJI: <span>{icon.value}</span>,
          ICON: <Icon icon={icon.value} />,
          URL: <img src={icon.value} />
        }[icon.type]
      }{' '}
    </IconWrapper>
  )
}

export default IconDisplay
