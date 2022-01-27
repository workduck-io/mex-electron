export type OnBoardStore = {
  isOnboarding: boolean
  changeOnboarding: (isOpen: boolean) => void
  step: number
  setStep: (step: number) => void
  flowMessage: string
  setFlowMessage: (msg: string) => void
}

export enum OnboardElements {
  QUICK_LINK = 'wd-mex-quick-link',
  FLOW_LINK = 'wd-mex-flow-link',
  FLOW_LINK_RESPONSE = 'wd-mex-flow-link-response',
  INLINE_BLOCK = 'wd-mex-inline-block'
}
