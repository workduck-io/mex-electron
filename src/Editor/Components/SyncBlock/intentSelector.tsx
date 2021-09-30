import React, { useState } from 'react'
import { Item, useContextMenu } from 'react-contexify'
import { capitalize } from '../../../Lib/strings'
import { MenuTrigger } from '../../../Styled/Integrations'
import Loading from '../../../Styled/Loading'
import { StyledMenu } from '../../../Styled/Menu'
import { Intent } from './SyncBlock.types'

export interface IntentSelectorProps {
  service: string
  type: string
  onSelect: (intent: Intent) => void
}

const MENU_ID = 'IntentSelectorMenu'

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

const IntentSelector = ({ service, type }: IntentSelectorProps) => {
  const [intents, setIntents] = useState<Intent[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const { show } = useContextMenu({
    id: MENU_ID
  })

  // useEffect(() => {
  //   // Fetch intents
  //   // Workspace ID, service, type

  //   const timeoutId = setTimeout(() => {
  //     setIntents(
  //       sampleIntents.map((si) => ({
  //         ...si,
  //         service,
  //         type,
  //       }))
  //     )
  //     setLoading(false)
  //   }, 2000)
  //   return () => clearTimeout(timeoutId)
  // }, [])

  function handleItemClick ({ event, props, triggerEvent, data }) {
    console.log(event, props, triggerEvent, data)
  }

  function displayMenu (e) {
    const timeoutId = setTimeout(() => {
      setIntents(
        sampleIntents.map((si) => ({
          ...si,
          service,
          type
        }))
      )
      setLoading(false)
    }, 2000)
    show(e, {
      position: {
        x: 0,
        y: 64
      }
    })
  }

  return (
    <div>
      {/* just display the menu on right click */}
      <MenuTrigger onClick={displayMenu}>
        Connect {capitalize(type)} with {capitalize(service)}
      </MenuTrigger>
      {/* run custom logic then display the menu */}
      {/* <div onContextMenu={displayMenu}>Right click inside the box</div> */}

      <StyledMenu id={MENU_ID}>
        {loading && <Loading dots={4} />}
        {intents.map((i) => (
          <Item key={`${i.name}-${i.service}`} onClick={handleItemClick}>
            {i.name} -{i.service}
          </Item>
        ))}
      </StyledMenu>
    </div>
  )
}

export default IntentSelector
