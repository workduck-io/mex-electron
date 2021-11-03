import githubFill from '@iconify-icons/ri/github-fill'
import refreshFill from '@iconify-icons/ri/refresh-fill'
import notionIcon from '@iconify/icons-simple-icons/notion'
import slackIcon from '@iconify/icons-simple-icons/slack'
import telegramIcon from '@iconify/icons-simple-icons/telegram'
import Mex from '../../../../assets/Icons/services/mex'
import React from 'react'

export const Icons: {
  [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
} = {
  TELEGRAM: telegramIcon,
  SLACK: slackIcon,
  NOTION: notionIcon,
  GITHUB: githubFill
}

export const getSyncServiceIcon = (s: string) => {
  const icon = Icons[s]
  if (icon) return icon
  return refreshFill
}

export const ServiceIcons: Record<string, any> = {
  GITHUB: 'github',
  SLACK: 'slack',
  LINEAR: 'linear',
  NOTION: 'notion',
  TELEGRAM: 'telegram'
}

export type ServiceIconType = { service: string; height: string; width: string }

export const ServiceIcon: React.FC<ServiceIconType> = ({ service, height, width }) => {
  const Icon = ServiceIcons[service]

  if (Icon) return <img src={`mex_window/assets/Icons/services/${Icon}.svg`} height={height} width={width} />
  return <Mex height={height} />
}
