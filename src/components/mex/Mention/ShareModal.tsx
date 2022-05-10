import { EMAIL_REG } from '@data/Defaults/auth'
import { useEditorStore } from '@store/useEditorStore'
import { useMentionStore } from '@store/useMentionStore'
import { ButtonFields, Label, StyledCreatatbleSelect } from '@style/Form'
import { AccessLevel, permissionOptions } from '../../../types/mentions'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import Modal from 'react-modal'
import create from 'zustand'
import { Button } from '../../../style/Buttons'
import { LoadingButton } from '../Buttons/LoadingButton'
import { InputFormError } from '../Forms/Input'
import { ModalControls, ModalHeader } from '../Refactor/styles'
import { SharedPermissionsWrapper, ShareRow } from './styles'

type ShareModalMode = 'invite' | 'permission'

interface ShareModalState {
  open: boolean
  focus: boolean
  mode: ShareModalMode
  data: {
    alias?: string
    fromEditor?: boolean
  }
  openModal: (mode: ShareModalMode) => void
  closeModal: () => void
  setFocus: (focus: boolean) => void
  prefillModal: (mode: ShareModalMode, alias?: string, fromEditor?: boolean) => void
}

export const useShareModalStore = create<ShareModalState>((set) => ({
  open: false,
  focus: true,
  mode: 'permission',
  data: {},
  openModal: (mode: ShareModalMode) =>
    set({
      mode,
      open: true
    }),
  closeModal: () => {
    set({
      open: false,
      focus: false
    })
  },
  setFocus: (focus: boolean) => set({ focus }),
  prefillModal: (mode: ShareModalMode, alias?: string, fromEditor?: boolean) =>
    set({
      mode,
      open: true,
      data: {
        alias,
        fromEditor
      },
      focus: false
    })
}))

interface InviteModalData {
  alias: string
  email: string
  access: string
}

const InviteModalContent = () => {
  const data = useShareModalStore((state) => state.data)
  const addInvitedUser = useMentionStore((state) => state.addInvitedUser)
  const node = useEditorStore((state) => state.node)
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm<InviteModalData>()

  const onSubmit = (data: InviteModalData) => {
    console.log('data', data)

    if (node && node.nodeid) {
      addInvitedUser({
        type: 'invite',
        alias: data.alias,
        email: data.email,
        access: {
          [node.nodeid]: (data.access as AccessLevel) ?? 'READ'
        }
      })
    }
  }

  return (
    <div>
      <h1>Invite</h1>
      <p>Invite your friends to join your team.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <Label htmlFor="access">Permission of the user</Label>
        <Controller
          control={control}
          render={({ field }) => (
            <StyledCreatatbleSelect
              {...field}
              defaultValue={{ value: 'READ', label: 'View' }}
              options={permissionOptions}
              closeMenuOnSelect={true}
              closeMenuOnBlur={true}
            />
          )}
          name="access"
        />

        <ButtonFields>
          <LoadingButton
            loading={isSubmitting}
            alsoDisabled={errors.email !== undefined || errors.alias !== undefined}
            buttonProps={{ type: 'submit', primary: true, large: true }}
          >
            Invite User
          </LoadingButton>
        </ButtonFields>
      </form>
    </div>
  )
}

interface PermissionModalContentProps {
  handleSubmit: () => void
  handleCopyLink: () => void
}

const PermissionModalContent = ({ handleSubmit, handleCopyLink }: PermissionModalContentProps) => {
  return (
    <div>
      <ModalHeader>Share Note</ModalHeader>

      <SharedPermissionsWrapper>
        <ShareRow>Mr Dank</ShareRow>
        <ShareRow>Mr Stank</ShareRow>
      </SharedPermissionsWrapper>

      <ModalControls>
        <Button large onClick={handleCopyLink}>
          Copy Link
        </Button>
        <Button primary autoFocus={!focus} large onClick={handleSubmit}>
          Save
        </Button>
      </ModalControls>
    </div>
  )
}

const ShareModal = () => {
  const open = useShareModalStore((store) => store.open)
  const focus = useShareModalStore((store) => store.focus)
  const closeModal = useShareModalStore((store) => store.closeModal)
  const mode = useShareModalStore((store) => store.mode)
  // const openModal = useShareModalStore((store) => store.openModal)

  // const shortcuts = useHelpStore((store) => store.shortcuts)
  // const { push } = useNavigation()
  // const { shortcutDisabled, shortcutHandler } = useKeyListener()

  // TODO: Add Share Modal shortcut
  // useEffect(() => {
  //   const unsubscribe = tinykeys(window, {
  //     [shortcuts.showShareModal.keystrokes]: (event) => {
  //       event.preventDefault()
  //       shortcutHandler(shortcuts.showShareModal, () => {
  //         openModal()
  //       })
  //     }
  //   })
  //   return () => {
  //     unsubscribe()
  //   }
  // }, [shortcuts, shortcutDisabled])

  const handleCopyLink = () => {
    closeModal()
  }

  const handleSave = () => {
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      {mode === 'invite' ? (
        <InviteModalContent />
      ) : (
        <PermissionModalContent handleSubmit={handleSave} handleCopyLink={handleCopyLink} />
      )}
    </Modal>
  )
}

export default ShareModal
