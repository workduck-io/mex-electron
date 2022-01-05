import { Icon } from '@iconify/react'
import { client } from '@workduck-io/dwindle'
import React, { useState } from 'react'
import { Item, useContextMenu } from 'react-contexify'
import useOnboard from '../../../Components/Onboarding/store'
import { useAuthStore } from '../../../Hooks/useAuth/useAuth'
import { capitalize } from '../../../Lib/strings'
import { integrationURLs } from '../../../Requests/routes'
import { MenuTrigger } from '../../../Styled/Integration'
import Loading from '../../../Styled/Loading'
import { StyledMenu } from '../../../Styled/Menu'
import { Intent } from './SyncBlock.types'
import { getSyncServiceIcon } from './SyncIcons'

export interface IntentSelectorProps {
  service: string
  id: string
  type: string
  readOnly?: boolean
  defaultIntent?: Intent
  showPosition?: {
    x: number
    y: number
  }
  onSelect?: (intent: Intent) => void
}

interface IntentSelectorState {
  intents: Intent[]
  loading: boolean
  selected: Intent | undefined
}

const IntentSelector = ({
  service,
  readOnly,
  id,
  type,
  showPosition,
  defaultIntent,
  onSelect
}: IntentSelectorProps) => {
  const [intentSelectorState, setIntentSelectorState] = useState<IntentSelectorState>({
    intents: [],
    loading: true,
    selected: defaultIntent
  })

  const MENU_ID = `IntentSelectorMenu_${service}_${type}_${id}`
  const workspaceId = useAuthStore((store) => store.workspaceDetails.id)
  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const { show } = useContextMenu({
    id: MENU_ID
  })

  // Fetch intents
  // Workspace ID, service, type

  function onIntentSelect(props, intent: Intent) {
    // console.log({ props, intent })
    setIntentSelectorState({
      ...intentSelectorState,
      selected: intent
    })
    // console.log('Calling Onselect')

    if (onSelect) onSelect(intent)
  }

  function displayMenu(e) {
    if (loading === true) {
      client
        .post(integrationURLs.getIntentValues, {
          serviceType: service?.toUpperCase(),
          intentType: type,
          workspaceId: workspaceId
        })
        .then((d) => {
          const { data } = d
          const intents: Intent[] = data.map((i) => ({
            service,
            type,
            value: i.id,
            name: i.name,
            options: i.options
          }))
          // console.log({ d })
          setIntentSelectorState((state) => ({ ...state, intents, loading: false }))
        })
    }
    show(e, {
      position: showPosition
    })
  }

  const { intents, loading, selected } = intentSelectorState

  return (
    <>
      <MenuTrigger
        readOnly={readOnly}
        selected={selected !== undefined}
        onClick={readOnly ? () => undefined : displayMenu}
      >
        <Icon icon={getSyncServiceIcon(service)} />
        {selected ? (
          <div>
            {selected.name} - {capitalize(type)}
          </div>
        ) : isOnboarding ? (
          <div>Onboard user</div>
        ) : (
          <div>Connect {capitalize(type)}</div>
        )}
      </MenuTrigger>

      <StyledMenu id={MENU_ID}>
        {loading && <Loading dots={4} />}
        {intents.map((i) => (
          <Item key={`${i.name}-${i.service}`} onClick={(e) => onIntentSelect(e, i)}>
            {i.name} -{i.service}
          </Item>
        ))}
      </StyledMenu>
    </>
  )
}

export default IntentSelector
