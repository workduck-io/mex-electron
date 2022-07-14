import { IpcAction } from '@data/IpcAction'
import { ipcRenderer } from 'electron'
import create from 'zustand'
import { persist } from 'zustand/middleware'

export enum ModalsType {
  blocks,
  delete,
  refactor,
  lookup,
  rename,
  releases,
  reminders,
  share,
  help
}

type ModalStoreType = {
  open: ModalsType | undefined
  init: ModalsType | undefined
  toggleOpen: (modalType: ModalsType, initialize?: boolean) => void
}

// * Create Unified Store for all Modals
// * This would make sure only one modal is present in DOM at a time.
const useModalStore = create<ModalStoreType>((set, get) => ({
  open: undefined,
  init: undefined,
  toggleOpen: (modalType, initialize?: boolean) => {
    const open = get().open
    const init = get().init

    if (init) ipcRenderer.send(IpcAction.SHOW_RELEASE_NOTES)

    const changeModalState = open === modalType ? undefined : modalType
    const initModal = initialize ? modalType : undefined

    set({ open: changeModalState, init: initModal })
  }
}))

export default useModalStore
