import githubFill from '@iconify/icons-ri/github-fill'
import refreshFill from '@iconify/icons-ri/refresh-fill'
import notionIcon from '@iconify/icons-simple-icons/notion'
import slackIcon from '@iconify/icons-simple-icons/slack'
import telegramIcon from '@iconify/icons-simple-icons/telegram'
import React from 'react'
import Asana from '../../../components/icons/Asana'
import Github from '../../../components/icons/github'
import Linear from '../../../components/icons/linear'
import Mex from '../../../components/icons/mex'
import Notion from '../../../components/icons/notion'
import Slack from '../../../components/icons/slack'
import Telegram from '../../../components/icons/Telgram'

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
  GITHUB: Github,
  SLACK: Slack,
  LINEAR: Linear,
  NOTION: Notion,
  TELEGRAM: Telegram,
  ASANA: Asana
}

export type ServiceIconType = { service: string; height: string; width: string }

export const ServiceIcon: React.FC<ServiceIconType> = ({ service, height, width }) => {
  const Icon = ServiceIcons[service]

  if (Icon) return <Icon height={height} width={width} />
  return <Mex height={height} width={width} />
}
