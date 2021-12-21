import { OnBoardStore } from './types'
import create from 'zustand'

const useOnboard = create<OnBoardStore>((set, get) => ({
  isOnboarding: false,
  changeOnboarding: (isOpen: boolean) => set({ isOnboarding: isOpen }),
  step: 0,
  setStep: (step: number) => set({ step }),
  flowMessage: '',
  setFlowMessage: (msg: string) => set({ flowMessage: msg })
}))

export default useOnboard
