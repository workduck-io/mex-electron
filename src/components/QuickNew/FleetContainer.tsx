import useModalStore, { ModalsType } from '@store/useModalStore';
import React, { useMemo } from 'react';
import Fleet from './'
import { useOnNewItem } from './useOnNewItem';

const FleetContainer = () => {
  const { getQuickNewItems } = useOnNewItem()
  const toggleOpen = useModalStore(store => store.toggleOpen)
  const open = useModalStore(store => store.open) === ModalsType.quickNew

  const handleOpen = () => toggleOpen(ModalsType.quickNew)
  const handleClose = () => toggleOpen(undefined)

  const sections = useMemo(getQuickNewItems, [])

  return <Fleet sections={sections} isOpen={open} onClose={handleClose} onOpen={handleOpen} />
}

export default FleetContainer 
