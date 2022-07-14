import React from 'react'
import {
  GoogleCalendarUserCard,
  GoogleCalendarUserAvatar,
  GoogleCalendarUserDetails,
  GoogleCalendarUserName
} from './styled'

interface GoogleCalendarUserProps {
  userDetails: {
    name: string
    picture: string
    email: string
  }
}

const GoogleCalendarUser = ({ userDetails }: GoogleCalendarUserProps) => {
  return (
    <GoogleCalendarUserCard>
      <GoogleCalendarUserAvatar src={userDetails.picture} referrerPolicy="no-referrer" />
      <GoogleCalendarUserDetails>
        <GoogleCalendarUserName>{userDetails.name}</GoogleCalendarUserName>
        <div>{userDetails.email}</div>
      </GoogleCalendarUserDetails>
    </GoogleCalendarUserCard>
  )
}

export default GoogleCalendarUser
