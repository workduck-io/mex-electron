import React from 'react'

import { InputFormError } from '@components/mex/Forms/Input'
import { ALIAS_REG } from '@data/Defaults/auth'
import { IS_DEV } from '@data/Defaults/dev_'
import deleteBack2Line from '@iconify/icons-ri/delete-back-2-line'
import edit2Line from '@iconify/icons-ri/edit-2-line'
import { useUserService } from '@services/auth/useUserService'
import { AuthForm, ButtonFields } from '@style/Form'
import { mog } from '@utils/lib/mog'
import { useForm } from 'react-hook-form'

import { IconButton, LoadingButton } from '@workduck-io/mex-components'

import { CopyButton } from '../../components/mex/Buttons/CopyButton'
import { ProfileImage } from '../../components/mex/User/ProfileImage'
import { useAuthStore } from '../../services/auth/useAuth'
import { Title } from '../../style/Typography'
import { Info, InfoData, InfoLabel, ProfileContainer, ProfileIcon, SettingsCard } from '../../style/UserPage'

export interface UpdateUserFormData {
  name: string
  alias: string
}

const UserPage = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const { updateUserInfo } = useUserService()

  const currentUserDetails = useAuthStore((store) => store.userDetails)
  const updateUserForm = useForm<UpdateUserFormData>()

  const onUpdateSave = async (data: UpdateUserFormData) => {
    // mog('onUpdateSave', { data })
    await updateUserInfo(currentUserDetails.userID, data.name, data.alias)
    updateUserForm.reset()
  }

  const updErrors = updateUserForm.formState.errors

  // mog('userForms', { currentUserDetails, fS: updateUserForm.formState, dfs: updateUserForm.formState.dirtyFields })

  return (
    <SettingsCard>
      <ProfileContainer>
        <ProfileIcon>
          <ProfileImage email={currentUserDetails?.email} size={128} />
        </ProfileIcon>

        <div>
          <Title>User</Title>
          <AuthForm onSubmit={updateUserForm.handleSubmit(onUpdateSave)}>
            <InputFormError
              name="name"
              label="Name"
              labelIcon={edit2Line}
              transparent
              inputProps={{
                placeholder: 'Ex: Cool Guy',
                defaultValue: currentUserDetails?.name,
                isDirty: updateUserForm.formState.dirtyFields?.name,
                ...updateUserForm.register('name')
              }}
              errors={updErrors}
            ></InputFormError>

            <InputFormError
              name="alias"
              label="Alias"
              transparent
              labelIcon={edit2Line}
              inputProps={{
                placeholder: 'Ex: CoolGal',
                defaultValue: currentUserDetails?.alias,
                isDirty: updateUserForm.formState.dirtyFields?.alias,
                ...updateUserForm.register('alias', {
                  pattern: ALIAS_REG
                })
              }}
              errors={updErrors}
            ></InputFormError>
            <Info>
              <InfoLabel>Email</InfoLabel>
              <InfoData>{currentUserDetails?.email}</InfoData>
            </Info>
            <Info>
              <InfoLabel>Workspace</InfoLabel>
              <InfoData>
                {getWorkspaceId()}
                <CopyButton text={getWorkspaceId()}></CopyButton>
              </InfoData>
            </Info>

            {IS_DEV && (
              <Info>
                <InfoLabel>User ID</InfoLabel>
                <InfoData>
                  {currentUserDetails?.userID}
                  <CopyButton text={currentUserDetails?.userID}></CopyButton>
                </InfoData>
              </Info>
            )}

            {updateUserForm.formState.isDirty && Object.keys(updateUserForm.formState.dirtyFields).length > 0 && (
              <ButtonFields>
                <LoadingButton loading={updateUserForm.formState.isSubmitting} type="submit" primary large>
                  Save Changes
                </LoadingButton>
                <IconButton
                  title="Cancel"
                  icon={deleteBack2Line}
                  onClick={() => {
                    updateUserForm.reset()
                  }}
                />
              </ButtonFields>
            )}
          </AuthForm>
        </div>
      </ProfileContainer>
    </SettingsCard>
  )
}

export default UserPage
