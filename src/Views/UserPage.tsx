import { useAuth } from '@workduck-io/dwindle'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from '../Styled/Buttons'
import { useAuthentication, useAuthStore } from '../Hooks/useAuth/useAuth'
import { BackCard } from '../Styled/Card'
import { CenteredColumn } from '../Styled/Layouts'
import { Title } from '../Styled/Typography'
import { Info, InfoData, InfoLabel, ProfileContainer, ProfileIcon } from '../Styled/UserPage'
import { ProfileImage } from '../Components/User/ProfileImage'
import { CopyButton } from '../Components/Buttons/CopyButton'
import useAnalytics from '../analytics'
import { CustomEvents } from '../analytics/events'

const UserPage = () => {
  const { getUserDetails } = useAuth()
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  const userDetails = getUserDetails()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  

  return (
    <CenteredColumn>
      <BackCard>
        <ProfileContainer>
          <ProfileIcon>
            <ProfileImage email={userDetails?.email} size={128} />
          </ProfileIcon>
          <div>
            <Title>User</Title>
            <Info>
              <InfoLabel>Email:</InfoLabel>
              <InfoData>{userDetails?.email}</InfoData>
            </Info>
            <Info>
              <InfoLabel>Workspace:</InfoLabel>
              <InfoData small>
                <CopyButton text={getWorkspaceId()}></CopyButton>
                {getWorkspaceId()}
              </InfoData>
            </Info>
          </div>
        </ProfileContainer>
       
      </BackCard>
    </CenteredColumn>
  )
}

export default UserPage
