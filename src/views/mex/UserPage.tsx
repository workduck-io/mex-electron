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
  const { getUserDetails } = useAuth()
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  const userDetails = getUserDetails()
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
            <Button onClick={handleGoogleAuthUrl}>Authorize Google Calendar</Button>
          </div>
        </ProfileContainer>
      </BackCard>
    </CenteredColumn>
  )
}

export default UserPage
