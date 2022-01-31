import { OnBoardStore } from '../components/mex/Onboarding/types'
import create from 'zustand'

const useOnboard = create<OnBoardStore>((set, get) => ({
  isOnboarding: false,
  isModalOpen: false,
  onboardBackup: undefined,
  setOnboardBackup: (backup: any) => set({ onboardBackup: backup }),
  setModal: (isOpen: boolean) => set({ isModalOpen: isOpen }),
  changeOnboarding: (isOpen: boolean) => set({ isOnboarding: isOpen }),
  step: 0,
  setStep: (step: number) => set({ step }),
  flowMessage: '',
  setFlowMessage: (msg: string) => set({ flowMessage: msg })
}))

export default useOnboard
