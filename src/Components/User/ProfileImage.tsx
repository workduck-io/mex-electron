import React, { useEffect, useState } from 'react'
import md5 from 'md5'
import Avatar from 'boring-avatars'
import { Icon } from '@iconify/react'
import user3Line from '@iconify-icons/ri/user-3-line'
import { useTheme } from 'styled-components'

interface ProfileImageProps {
  email: string
  size: number
}

const protocol = '//'
const domain = 'www.gravatar.com'
const base = `${protocol}${domain}/avatar/`

export const ProfileImage = ({ email, size }: ProfileImageProps) => {
  // 0 => not fetched yet
  // 1 => found
  // -1 => not found
  const [gravState, setGravState] = useState(0)

  const theme = useTheme()
  const colors = [theme.colors.gray[8], theme.colors.secondary, theme.colors.text.fade, theme.colors.primary]

  const params = {
    s: size.toString(),
    r: 'pg',
    d: '404'
  }
  const query = new URLSearchParams(params)
  // Gravatar service currently trims and lowercases all registered emails
  const formattedEmail = ('' + email).trim().toLowerCase()
  const hash = md5(formattedEmail, { encoding: 'binary' })
  const src = `${base}${hash}?${query.toString()}`

  useEffect(() => {
    // Check if the gravatar exists
    const img = new Image()
    img.src = src
    img.onload = () => {
      setGravState(1) // It does
    }
    img.onerror = () => {
      setGravState(-1) // It doesn't
    }
  }, [email])

  if (gravState === 1) return <img src={src} alt={email ? `Gravatar for ${formattedEmail}` : 'Gravatar'} />

  if (gravState === -1) return <Avatar size={size} square name={email} colors={colors} variant="beam" />

  // Rendered if both fail
  return <Icon className="defaultProfileIcon" icon={user3Line} height={size} />
}
