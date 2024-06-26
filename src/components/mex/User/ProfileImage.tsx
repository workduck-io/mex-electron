import React, { useEffect, useMemo, useState } from 'react'

import { MentionTooltipComponent } from '@editor/Components/mentions/components/MentionElement'
import { useMentions } from '@hooks/useMentions'
import user3Line from '@iconify/icons-ri/user-3-line'
import { Icon } from '@iconify/react'
import { useUserService } from '@services/auth/useUserService'
import { useCacheStore } from '@store/useRequestCache'
import Tippy from '@tippyjs/react/headless'
// different import path!
import { mog } from '@utils/lib/mog'
import Avatar from 'boring-avatars'
import md5 from 'md5'
import styled, { useTheme } from 'styled-components'

import Centered from '../../../style/Layouts'
import { CardShadow } from '../../../style/helpers'
import { AccessLevel } from '../../../types/mentions'

interface ProfileImageProps {
  email: string
  size: number
  // Component to replace the default image
  DefaultFallback?: React.ComponentType
}

const protocol = '//'
const domain = 'www.gravatar.com'
const base = `${protocol}${domain}/avatar/`

const ProfileTooptip = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  max-height: 400px;
  max-width: 700px;
  overflow-y: auto;
  ${CardShadow}
  background: ${({ theme }) => theme.colors.gray[8]} !important;
  color: ${({ theme }) => theme.colors.text.default};
  &::after {
    border-right-color: ${({ theme }) => theme.colors.primary} !important;
  }
`

export const ProfileImage = ({ email, size, DefaultFallback }: ProfileImageProps) => {
  // 0 => not fetched yet
  // 1 => found
  // -1 => not found
  const [gravState, setGravState] = useState(0)

  const theme = useTheme()
  const colors = theme.additional.profilePalette
  const addGravatarAbsent = useCacheStore((store) => store.addGravatarAbsent)

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
    const gravatarAbsent = useCacheStore.getState().gravatarAbsent
    // mog('grabbing gravatar for', { email, src, formattedEmail, gravatarAbsent })
    if (gravatarAbsent.includes(email)) {
      setGravState(-1)
      return
    }
    // Check if the gravatar exists
    const img = new Image()
    img.src = src
    img.onload = () => {
      setGravState(1) // It does
    }
    img.onerror = () => {
      // mog('gravatar not found', { email, src, formattedEmail })
      addGravatarAbsent(email)
      setGravState(-1) // It doesn't
    }
  }, [email])

  if (gravState === 1) return <img src={src} alt={email ? `Gravatar for ${formattedEmail}` : 'Gravatar'} />
  if (DefaultFallback !== undefined) return <DefaultFallback />
  if (gravState === -1) return <Avatar size={size} square name={email} colors={colors} variant="beam" />

  // Rendered if both fail
  return <Icon className="defaultProfileIcon" icon={user3Line} height={size} />
}

interface ProfileImageTooltipProps {
  userid: string
  size: number
  access?: AccessLevel
  // Component to replace the default image
  DefaultFallback?: React.ComponentType
}

interface ProfileImageWithToolTipProps {
  props: ProfileImageTooltipProps
  placement?: string
  interactive?: boolean
}

export const ProfileAvatar: React.FC<{ userId: string; size: number }> = ({ userId, size }) => {
  const { getUserFromUserid } = useMentions()
  const { getUserDetailsUserId } = useUserService()

  const user = useMemo(() => {
    const u = getUserFromUserid(userId)
    if (u) return u
    else {
      getUserDetailsUserId(userId)
        .then((d) => mog('GOT userId', { d }))
        .catch((err) => mog('GOT ERROR', { err }))
    }
  }, [userId])

  return <ProfileImage size={size} email={user?.email} />
}

export const ProfileImageWithToolTip = ({ props, placement, interactive }: ProfileImageWithToolTipProps) => {
  const { userid, size, DefaultFallback, access } = props // eslint-disable-line react/prop-types
  const { getUserFromUserid } = useMentions()
  const { getUserDetailsUserId } = useUserService()

  const user = useMemo(() => {
    const u = getUserFromUserid(userid)
    if (u) return u
    else {
      getUserDetailsUserId(userid)
        .then((d) => mog('GOT USERID', { d }))
        .catch((err) => mog('GOT ERROR', { err }))
    }
  }, [userid])

  return (
    <Tippy
      delay={500}
      interactiveDebounce={100}
      interactive={interactive}
      placement={(placement as any) ?? 'auto'}
      appendTo={() => document.body}
      render={(attrs) => <MentionTooltipComponent user={user} access={access} hideAccess={!access}/>}
    >
      <Centered style={{ width: `${size}px`, height: `${size}px` }}>
        <ProfileImage size={size} email={user?.email} DefaultFallback={DefaultFallback} />
      </Centered>
    </Tippy>
  )
}
