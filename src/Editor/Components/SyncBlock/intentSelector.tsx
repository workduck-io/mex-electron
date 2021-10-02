import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { Item, useContextMenu } from 'react-contexify'
import { capitalize } from '../../../Lib/strings'
import { MenuTrigger } from '../../../Styled/Integrations'
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
  onSelect: (intent: Intent) => void
}

const sampleIntents = [
  {
    name: 'repository maximus',
    value: 'repomaximus'
  },
  {
    name: 'chud tan maximus',
    value: 'jkshfjyurfweb'
  },
  {
    name: 'chud ran minimal',
    value: 'kajdsfhjkdasf'
  },
  {
    name: 'lowen maximus',
    value: 'sdajhfjkdlafhjkadsfh'
  },
  {
    name: 'allure pure',
    value: 'jhsdkflhiar'
  }
]

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
  const { show } = useContextMenu({
    id: MENU_ID
  })

  // Fetch intents
  // Workspace ID, service, type

  function onIntentSelect (props, intent: Intent) {
    console.log({ props, intent })
    setIntentSelectorState({
      ...intentSelectorState,
      selected: intent
    })
    console.log('Calling Onselect')

    onSelect(intent)
  }

  function displayMenu (e) {
    setTimeout(() => {
      if (loading === true) {
        setIntentSelectorState({
          ...intentSelectorState,
          intents: sampleIntents.map((si) => ({
            ...si,
            service,
            type
          })),
          loading: false
        })
      }
    }, 2000)
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
