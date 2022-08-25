import create from 'zustand'

export interface TemplateModalData {
  templateID?: string
  nodeid?: string
}

interface TemplateModalState {
  open: boolean
  focus: boolean
  data: TemplateModalData
  openModal: (nodeid?: string) => void
  closeModal: () => void
  setFocus: (focus: boolean) => void
  prefillModal: (data: TemplateModalData) => void
}

export const useTemplateModalStore = create<TemplateModalState>((set, get) => ({
  open: false,
  focus: true,
  data: {},
  openModal: (nodeid) =>
    set({
      open: true,
      data: { nodeid }
    }),
  closeModal: () => {
    set({
      open: false,
      focus: false,
      data: {}
    })
  },
  setFocus: (focus: boolean) => set({ focus }),
  prefillModal: (data: TemplateModalData) =>
    set({
      open: true,
      data: {
        ...get().data,
        ...data
      },
      focus: false
    })
}))
