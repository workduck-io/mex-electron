import { Button } from '@udecode/plate'
import React from 'react'
import { Command } from '../../../../../components/mex/NodeIntentsModal/styled'
import { CenteredFlex } from '../../../../../style/Integration'
import { useLinks } from '../../../../../hooks/useLinks'
import useLoad from '../../../../../hooks/useLoad'
import { StyledTypography } from '../../components/welcome.style'
import { performClick } from '../../steps'
import useOnboard from '../../../../../store/useOnboarding'

export const useTourStepper = () => {
  const step = useOnboard((store) => store.step)
  const changeStep = useOnboard((store) => store.setStep)

  const nextStep = () => changeStep(step + 1)

  return { step, changeStep, nextStep }
}

const QuickLinkTour = () => {
  const { loadNode } = useLoad()
  const { getUidFromNodeId } = useLinks()

  const onLoad = () => {
    loadNode(getUidFromNodeId('doc'))
    performClick()
  }

  return (
    <>
      <div>
        Create quick links using{' '}
        <Command>
          <strong> [[ </strong>
        </Command>
        command
      </div>
      <StyledTypography margin="0.5rem 0" size="0.8rem" color="#aaa" maxWidth="100%">
        Incase you want to link your thoughts together
      </StyledTypography>
      <CenteredFlex>
        <Button onClick={onLoad}>Take me to &quot;doc&quot;</Button>
      </CenteredFlex>
    </>
  )
}

export default QuickLinkTour
