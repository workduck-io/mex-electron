import { useAuth } from '@workduck-io/dwindle'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from '../Styled/Buttons'
import { useAuthentication } from '../Hooks/useAuth/useAuth'
import { BackCard } from '../Styled/Card'
import { CenteredColumn } from '../Styled/Layouts'
import { Title } from '../Styled/Typography'
import { Icon } from '@iconify/react'
import user3Line from '@iconify-icons/ri/user-3-line'
import { WORKSPACE_ID } from '../Defaults/auth'
import { Info, InfoData, InfoLabel, ProfileContainer, ProfileIcon } from '../Styled/UserPage'
import { ProfileImage } from '../Components/User/ProfileImage'

const UserPage = () => {
  const { getUserDetails } = useAuth()
  const { logout } = useAuthentication()
  const history = useHistory()

  const userDetails = getUserDetails()

  const onLogout = (e: any) => {
    e.preventDefault()
    logout()
    history.push('/login')
  }

  return (
    <CenteredColumn>
      <BackCard>
        <ProfileContainer>
          <ProfileIcon>
            <ProfileImage email={userDetails.email} size={128} />
          </ProfileIcon>
          <div>
            <Title>User</Title>
            <Info>
              <InfoLabel>Email:</InfoLabel>
              <InfoData>{userDetails.email}</InfoData>
            </Info>
            <Info>
              <InfoLabel>Workspace:</InfoLabel>
              <InfoData>{WORKSPACE_ID}</InfoData>
            </Info>
          </div>
        </ProfileContainer>
        <Button size="large" onClick={onLogout}>
          Logout
        </Button>
      </BackCard>
    </CenteredColumn>
  )
}

export default UserPage
