import React, { useMemo } from 'react'

import useModalStore, { ModalsType } from '@store/useModalStore'

import { Fleet } from '@workduck-io/mex-components'

import { useOnNewItem } from './useOnNewItem'

const FleetContainer = () => {
  const { getQuickNewItems } = useOnNewItem()
  const toggleOpen = useModalStore((store) => store.toggleOpen)
  const open = useModalStore((store) => store.open === ModalsType.quickNew)

  const handleOpen = () => toggleOpen(ModalsType.quickNew)
  const handleClose = () => {
    const isFleetOpen = useModalStore.getState().open === ModalsType.quickNew
    
    if (isFleetOpen) toggleOpen(undefined)
  }

  const sections = useMemo(getQuickNewItems, [])

  return <Fleet sections={sections} isOpen={open} onClose={handleClose} onOpen={handleOpen} />
}

export default FleetContainer
