import React from 'react'
import styled, { css, useTheme } from 'styled-components'
import { MexIcon } from '../../../../style/Layouts'
import Loading from '../../../../style/Loading'
import { DisplayShortcut } from '../../../mex/Shortcuts'
import { useActionStore } from '../../Actions/useActionStore'
import { ShortcutText } from '../../Home/components/Item'
import WDLogo from '../../Search/Logo'
import Tippy from '@tippyjs/react'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'
import { useRouting } from '../../../../views/routes/urls'
import { Button } from '../../../../style/Buttons'

const JoinService = styled.span<{ left?: boolean }>`
  position: absolute;
  top: 20vh;
  height: 40vh;
  ${({ left }) =>
    left
      ? css`
          left: 6rem;
        `
      : css`
          right: 6rem;
        `}

  section {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
  }
`

const Connector = styled.span`
  padding: 2rem;
`

const Blur = css`
  width: 5rem;
  height: 4rem;
  right: 6rem;
  filter: blur(3rem);
  border-radius: 2rem;
`

const TopBlur = styled.span`
  ${Blur}
  position: absolute;
  top: 20vh;
  background: rgba(255, 255, 255, 0.5);
`

const BottomBlur = styled.span`
  ${Blur}
  position: absolute;
  top: 40vh;
  background: ${({ theme }) => theme.colors.primary};
`

const FloatingGroup = styled.div`
  display: flex;
  gap: 0 1rem;
  border-radius: ${(props) => props.theme.borderRadius.small};
  border: none;
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
`

const FormButton = styled(Button)`
  padding: ${(props) => props.theme.spacing.small} ${(props) => props.theme.spacing.medium};
`

const BorderButton = styled(Button)`
  background: transparent;
  padding: ${(props) => props.theme.spacing.small} ${(props) => props.theme.spacing.medium};
  border: 1px solid ${({ theme }) => theme.colors.form.button.bg};
`

type ActionsRightSectionProps = { actionGroupId: string; isLoading?: boolean }

export const RightActionSection: React.FC<ActionsRightSectionProps> = ({ actionGroupId, isLoading }) => {
  const theme = useTheme()
  const actionGroups = useActionStore((store) => store.actionGroups)
  const setView = useSpotlightAppStore((store) => store.setView)
  const isSubmitting = useActionStore((store) => store.isSubmitting)
  const { goBack } = useRouting()

  const onCancelClick = () => {
    setView(undefined)
    goBack()
  }

  return (
    <>
      <TopBlur />
      <JoinService>
        <section>
          <MexIcon color={theme.colors.primary} icon={actionGroups?.[actionGroupId]?.icon} height="4rem" width="4rem" />
          {isSubmitting ? <Loading transparent dots={3} orientation="vertical" direction="reverse" /> : <Connector />}
          <WDLogo padding="0" height="3.5rem" width="3.5rem" />
        </section>
      </JoinService>
      <BottomBlur />
      <FloatingGroup>
        <Tippy
          theme="mex"
          placement="auto"
          content={
            <ShortcutText key="send">
              <div className="text">Cancel&nbsp;</div> (<DisplayShortcut shortcut="Esc" />)
            </ShortcutText>
          }
        >
          <BorderButton onClick={onCancelClick}>Discard</BorderButton>
        </Tippy>
        <Tippy
          theme="mex"
          placement="auto"
          content={
            <ShortcutText key="send">
              <div className="text">Send&nbsp;</div> (<DisplayShortcut shortcut="$mod+Enter" />)
            </ShortcutText>
          }
        >
          <FormButton form="action-form" type="submit" color={theme.colors.primary}>
            Create
          </FormButton>
        </Tippy>
      </FloatingGroup>
    </>
  )
}
