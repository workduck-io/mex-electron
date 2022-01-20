export type OnBoardStore = {
  isOnboarding: boolean
  changeOnboarding: (isOpen: boolean) => void
  step: number
  setStep: (step: number) => void
  flowMessage: string
  setFlowMessage: (msg: string) => void
}
