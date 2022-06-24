import { actionStore, Provider } from '@components/spotlight/Actions/useActionStore'
import { actionMenuStore, MenuProvider } from '@components/spotlight/ActionStage/ActionMenu/useActionMenuStore'
import React from 'react'
import GlobalSection from '.'

type Props = {
  actionGroupId: string
  isConnected: boolean
  globalActionId?: string
}

const GlobalSectionProvider: React.FC<Props> = ({ actionGroupId, isConnected, globalActionId }) => {
  return (
    <Provider createStore={actionStore}>
      <MenuProvider createStore={actionMenuStore}>
        {isConnected && globalActionId && <GlobalSection globalId={globalActionId} actionGroupId={actionGroupId} />}
      </MenuProvider>
    </Provider>
  )
}

export default GlobalSectionProvider
