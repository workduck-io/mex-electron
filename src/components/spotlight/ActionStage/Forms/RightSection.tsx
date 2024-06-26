import React from 'react'
import styled, { css, useTheme } from 'styled-components'
import { MexIcon } from '../../../../style/Layouts'
import Loading from '../../../../style/Loading'
import { useActionStore } from '../../Actions/useActionStore'
import { ShortcutText } from '../../Home/components/Item'
import WDLogo from '../../Search/Logo'
import Tippy from '@tippyjs/react'
import { useRouting } from '../../../../views/routes/urls'
import ActionMenu from '../ActionMenu'
import { NoOption } from '../ActionMenu/styled'
import { useActionMenuStore } from '../ActionMenu/useActionMenuStore'
import { useActionsCache } from '@components/spotlight/Actions/useActionsCache'
import { usePlateEditorRef } from '@udecode/plate'
import { getIconType, ProjectIconMex } from '../Project/ProjectIcon'
import { DEFAULT_LIST_ITEM_ICON } from '../ActionMenu/ListSelector'
import { useReadOnly } from 'slate-react'
import { Button, DisplayShortcut } from '@workduck-io/mex-components'

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
  const element = useActionStore((store) => store.element)
  const getConfig = useActionsCache((store) => store.getConfig)
  const actionGroups = useActionsCache((store) => store.actionGroups)
  const setView = useActionStore((store) => store.setView)
  const isSubmitting = useActionStore((store) => store.isSubmitting)
  const isActiveItem = useActionStore((store) => store.viewData)
  const hideMenu = useActionMenuStore((store) => store.hideMenu)
  const isView = useActionStore((store) => store.view) === 'item'
  const isEditor = usePlateEditorRef()

  const onCancelClick = () => {
    setView(undefined)
    goBack()
  }

  const readOnly = useReadOnly()
  const config = getConfig(actionGroupId, actionId)

  if (config?.postAction?.menus && !readOnly && !hideMenu && isActiveItem && !isView && !element?.actionContext?.view) {
    return <ActionMenu title="Options" />
  }

  const icon = actionGroups?.[actionGroupId]?.icon
  const { mexIcon } = getIconType(icon || DEFAULT_LIST_ITEM_ICON)

  if (config?.form && !isView)
    return (
      <>
        {!isEditor && (
          <>
            <TopBlur />
            <JoinService>
              <section>
                <ProjectIconMex isMex={mexIcon} color={theme.colors.primary} icon={icon} size={40} />
                {isSubmitting ? (
                  <Loading transparent dots={3} orientation="vertical" direction="reverse" />
                ) : (
                  <Connector />
                )}
                <WDLogo padding="0" height="3.5rem" width="3.5rem" />
              </section>
            </JoinService>
            <BottomBlur />
          </>
        )}
        <FloatingGroup>
          {!isEditor && (
            <Tippy
              theme="mex"
              arrow={false}
              placement="top"
              content={
                <ShortcutText key="send">
                  <div className="text">Cancel&n bsp;</div> <DisplayShortcut shortcut="Esc" />
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
          )}
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
            <FormButton form={`action-form-${element?.id}`} type="submit" color={theme.colors.primary}>
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
