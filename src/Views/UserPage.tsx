import { useAuth } from '@workduck-io/dwindle'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button } from '../Styled/Buttons'
import { useAuthentication } from '../Hooks/useAuth/useAuth'
import { BackCard, FooterCard } from '../Styled/Card'
import { CenteredColumn } from '../Styled/Layouts'
import { Title } from '../Styled/Typography'

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
        <Title>UserPage</Title>
        <p>{userDetails.email}</p>
      </BackCard>
      <FooterCard>
        <Button onClick={onLogout}>Logout</Button>
        <Link to={'/register'}>Register</Link>
      </FooterCard>
    </CenteredColumn>
  )
}

export default UserPage
