import { useAuth } from '@workduck-io/dwindle'
import React from 'react'
import { CopyButton } from '../../Components/mex/Buttons/CopyButton'
import { ProfileImage } from '../../components/mex/User/ProfileImage'
import { useAuthStore } from '../../services/auth/useAuth'
import { BackCard } from '../../style/Card'
import { CenteredColumn } from '../../style/Layouts'
import { Title } from '../../style/Typography'
import { Info, InfoData, InfoLabel, ProfileContainer, ProfileIcon } from '../../style/UserPage'

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
