import create from 'zustand'

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
  toggleOpen: (modalType: ModalsType) => void
}

// * Create Unified Store for all Modals
// * This would make sure only one modal is present in DOM at a time.
const useModalStore = create<ModalStoreType>((set, get) => ({
  open: undefined,
  toggleOpen: (modalType) => {
    const open = get().open
    const changeModalState = open === modalType ? undefined : modalType

    set({ open: changeModalState })
  }
}))

export default useModalStore
