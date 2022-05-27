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
import ActionMenu from '../ActionMenu'
import { NoOption } from '../ActionMenu/styled'
import useActionMenuStore from '../ActionMenu/useActionMenuStore'
import { useActionsCache } from '@components/spotlight/Actions/useActionsCache'

const JoinService = styled.span<{ left?: boolean }>`
  position: absolute;
  top: 20vh;
  height: 40vh;
  ${({ left }) =>
    left
      ? css`
          left: 7rem;
        `
      : css`
          right: 7rem;
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
  right: 7rem;
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

export const FormButton = styled(Button)`
  padding: ${(props) => props.theme.spacing.small} ${(props) => props.theme.spacing.medium};
`

const BorderButton = styled(Button)`
  background: transparent;
  padding: ${(props) => props.theme.spacing.small} ${(props) => props.theme.spacing.medium};
  border: 1px solid ${({ theme }) => theme.colors.form.button.bg};
`

type ActionsRightSectionProps = { actionGroupId: string; actionId: string; isLoading?: boolean }

export const RightActionSection: React.FC<ActionsRightSectionProps> = ({ actionGroupId, actionId, isLoading }) => {
  const theme = useTheme()
  const { goBack } = useRouting()
  const getConfig = useActionsCache((store) => store.getConfig)
  const actionGroups = useActionsCache((store) => store.actionGroups)
  const setView = useActionStore((store) => store.setView)
  const isSubmitting = useActionStore((store) => store.isSubmitting)
  const isActiveItem = useActionStore((store) => store.viewData)
  const hideMenu = useActionMenuStore((store) => store.hideMenu)

  const onCancelClick = () => {
    setView(undefined)
    goBack()
  }

  const config = getConfig(actionGroupId, actionId)

  if (config?.postAction?.menus && !hideMenu && isActiveItem) {
    return <ActionMenu title="Options" />
  }

  if (config?.form)
    return (
      <>
        <TopBlur />
        <JoinService>
          <section>
            <MexIcon
              color={theme.colors.primary}
              icon={actionGroups?.[actionGroupId]?.icon}
              height="4rem"
              noHover
              width="4rem"
            />
            {isSubmitting ? <Loading transparent dots={3} orientation="vertical" direction="reverse" /> : <Connector />}
            <WDLogo padding="0" height="3.5rem" width="3.5rem" />
          </section>
        </JoinService>
        <BottomBlur />
        <FloatingGroup>
          <Tippy
            theme="mex"
            arrow={false}
            placement="top"
            content={
              <ShortcutText key="send">
                <div className="text">Cancel&nbsp;</div> <DisplayShortcut shortcut="Esc" />
              </ShortcutText>
            }
          >
            <BorderButton onClick={onCancelClick}>
              <NoOption>
                <MexIcon
                  noHover
                  icon="material-symbols:cancel-outline-rounded"
                  height="1.25rem"
                  width="1.25rem"
                  margin="0 0.5rem 0 0"
                />
                Discard
              </NoOption>
            </BorderButton>
          </Tippy>
          <Tippy
            theme="mex"
            arrow={false}
            placement="top"
            content={
              <ShortcutText key="send">
                <div className="text">Send&nbsp;</div> <DisplayShortcut shortcut="$mod+Enter" />
              </ShortcutText>
            }
          >
            <FormButton form="action-form" type="submit" color={theme.colors.primary}>
              <NoOption>
                <MexIcon noHover icon="ion:create-outline" margin="0 0.5rem 0 0" height="1.25rem" width="1.25rem" />
                Create
              </NoOption>
            </FormButton>
          </Tippy>
        </FloatingGroup>
      </>
    )

  return <></>
}
