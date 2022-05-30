import { useAuth } from '@workduck-io/dwindle'
import React from 'react'
import { useApi } from '../../apis/useSaveApi'
import { CopyButton } from '../../components/mex/Buttons/CopyButton'
import { ProfileImage } from '../../components/mex/User/ProfileImage'
import { useAuthStore } from '../../services/auth/useAuth'
import { Button } from '../../style/Buttons'
import { BackCard } from '../../style/Card'
import { CenteredColumn } from '../../style/Layouts'
import { Title } from '../../style/Typography'
import { Info, InfoData, InfoLabel, ProfileContainer, ProfileIcon } from '../../style/UserPage'
import { mog } from '../../utils/lib/helper'

const UserPage = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  const currentUserDetails = useAuthStore((store) => store.userDetails)
  const { getGoogleAuthUrl } = useApi()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGoogleAuthUrl = async () => {
    const googleAuthUrl = await getGoogleAuthUrl()
    mog('googleAuthUrl', { googleAuthUrl })
    window.open(googleAuthUrl, '_blank', 'width=1000,height=1000')
    // TODO: fetch the google refresh token from the auth service and set in the local auth store
  }

  return (
    <CenteredColumn>
      <BackCard>
        <ProfileContainer>
          <ProfileIcon>
            <ProfileImage email={currentUserDetails?.email} size={128} />
          </ProfileIcon>
          <div>
            <Title>User</Title>
            <Info>
              <InfoLabel>Name:</InfoLabel>
              <InfoData>{currentUserDetails?.name}</InfoData>
            </Info>
            <Info>
              <InfoLabel>Email:</InfoLabel>
              <InfoData>{currentUserDetails?.email}</InfoData>
            </Info>
            <Info>
              <InfoLabel>Alias:</InfoLabel>
              <InfoData>{currentUserDetails?.alias ?? 'Warning: Unset'}</InfoData>
            </Info>
            <Info>
              <InfoLabel>Workspace:</InfoLabel>
              <InfoData small>
                <CopyButton text={getWorkspaceId()}></CopyButton>
                {getWorkspaceId()}
              </InfoData>
            </Info>
            <Button onClick={handleGoogleAuthUrl}>Authorize Google Calendar</Button>
          </div>
        </ProfileContainer>
      </BackCard>
    </CenteredColumn>
  )
}

export default UserPage
