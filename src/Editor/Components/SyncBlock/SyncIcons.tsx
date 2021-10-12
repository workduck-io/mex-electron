import githubFill from '@iconify-icons/ri/github-fill'
import refreshFill from '@iconify-icons/ri/refresh-fill'
import notionIcon from '@iconify/icons-simple-icons/notion'
import slackIcon from '@iconify/icons-simple-icons/slack'
import telegramIcon from '@iconify/icons-simple-icons/telegram'

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
