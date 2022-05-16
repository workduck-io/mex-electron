import { EMAIL_REG } from '@data/Defaults/auth'
import { useMentions } from '@hooks/useMentions'
import { useUserService } from '@services/auth/useUserService'
import { useEditorStore } from '@store/useEditorStore'
import { ButtonFields, Label, SelectWrapper, StyledCreatatbleSelect } from '@style/Form'
import { Title } from '@style/Typography'
import { mog } from '@utils/lib/helper'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AccessLevel, DefaultPermission, DefaultPermissionValue, permissionOptions } from '../../../types/mentions'
import { LoadingButton } from '../Buttons/LoadingButton'
import { InputFormError } from '../Forms/Input'
import { InviteFormWrapper, InviteWrapper } from './ShareModal.styles'
import { InviteModalData, useShareModalStore } from './ShareModalStore'

export const InviteModalContent = () => {
  const data = useShareModalStore((state) => state.data)
  const { getUserDetails } = useUserService()
  const node = useEditorStore((state) => state.node)
  const { inviteUser, addMentionable } = useMentions()
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm<InviteModalData>()

  const onSubmit = async (data: InviteModalData) => {
    mog('data', data)

    if (node && node.nodeid) {
      const details = await getUserDetails(data.email)
      if (details) {
        console.log({ details })
        //const res = addMentionable(data.alias, data.email, userid, node.nodeid, data.access as AccessLevel ?? DefaultPermission)
        //   // Get userid from res
        //   replaceUserMention(editor, alias, res.userid)
      } else {
        inviteUser(data.email, data.alias, node.nodeid, (data.access as AccessLevel) ?? DefaultPermission)
      }
    }
  }

  return (
    <InviteWrapper>
      <Title>Invite</Title>
      <p>Invite your friends to your Note.</p>
      <InviteFormWrapper onSubmit={handleSubmit(onSubmit)}>
        <InputFormError
          name="alias"
          label="Alias"
          inputProps={{
            defaultValue: data.alias ?? '',
            ...register('alias', {
              required: true
            })
          }}
          errors={errors}
        ></InputFormError>
        <InputFormError
          name="email"
          label="Email"
          inputProps={{
            autoFocus: true,
            ...register('email', {
              required: true,
              pattern: EMAIL_REG
            })
          }}
          errors={errors}
        ></InputFormError>

        <SelectWrapper>
          <Label htmlFor="access">Permission</Label>
          <Controller
            control={control}
            render={({ field }) => (
              <StyledCreatatbleSelect
                {...field}
                defaultValue={DefaultPermissionValue}
                options={permissionOptions}
                closeMenuOnSelect={true}
                closeMenuOnBlur={true}
              />
            )}
            name="access"
          />
        </SelectWrapper>

        <ButtonFields>
          <LoadingButton
            loading={isSubmitting}
            alsoDisabled={errors.email !== undefined || errors.alias !== undefined}
            buttonProps={{ type: 'submit', primary: true, large: true }}
          >
            Invite
          </LoadingButton>
        </ButtonFields>
      </InviteFormWrapper>
    </InviteWrapper>
  )
}

// interface PermissionModalContentProps { }
