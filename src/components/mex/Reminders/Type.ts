import { NodeEditorContent } from '@types/Types'

export interface ModalValue {
  time?: number
  nodeid?: string
  todoid?: string
  description?: string
  blockContent?: NodeEditorContent
}

export interface CreateReminderModalState {
  open: boolean
  focus: boolean

  modalValue: ModalValue
  toggleModal: () => void
  openModal: (modalValue?: ModalValue) => void
  setFocus: (focus: boolean) => void
  closeModal: () => void
  setModalValue: (modalValue: ModalValue) => void
  setTime: (time: number) => void
  setNodeId: (nodeid: string) => void
}
