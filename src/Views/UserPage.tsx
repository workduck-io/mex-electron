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
import { ProfileContainer } from '../Styled/UserPage'

const UserPage = () => {
  const { getUserDetails } = useAuth()
  const { logout } = useAuthentication()
  const history = useHistory()

  const userDetails = getUserDetails()

  const onLogout = (e) => {
    e.preventDefault()
    logout()
    history.push('/login')
  }

  return (
    <CenteredColumn>
      <BackCard>
        <ProfileContainer>
          <div>
            <Title>User</Title>
            <p>Email: {userDetails.email}</p>
            <p>Workspace: {WORKSPACE_ID}</p>
          </div>
          <div>
            <Icon icon={user3Line} />
          </div>
        </ProfileContainer>
        <Button onClick={onLogout}>Logout</Button>
      </BackCard>
    </CenteredColumn>
  )
}

export default UserPage
