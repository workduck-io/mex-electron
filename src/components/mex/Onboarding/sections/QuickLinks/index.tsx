import { Button } from '@udecode/plate'
import React from 'react'
import { Command } from '../../../../../components/mex/NodeIntentsModal/styled'
import { PrimaryText } from '../../../../../style/Integration'
import { useLinks } from '../../../../../hooks/useLinks'
import useLoad from '../../../../../hooks/useLoad'
import { StyledTypography, WelcomeHeader } from '../../components/welcome.style'
import { performClick } from '../../steps'
import useOnboard from '../../../../../store/useOnboarding'
import { useHistory } from 'react-router-dom'
import { useOnboardingData } from '../../hooks'
import { FlexBetween } from '../../../../../editor/Components/InlineBlock/styled'
import { useTheme } from 'styled-components'

export const useTourStepper = () => {
  const step = useOnboard((store) => store.step)
  const changeStep = useOnboard((store) => store.setStep)

  const nextStep = () => changeStep(step + 1)

  return { step, changeStep, nextStep }
}

export const QuickLinkTour = () => {
  const theme = useTheme()
  return (
    <>
      <WelcomeHeader>
        <StyledTypography size="2rem" color={theme.colors.primary} margin="0" maxWidth="100%">
          Quick Links
        </StyledTypography>
      </WelcomeHeader>
      <br />
      <br />
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
      <br />
      <div>
        Click on the <PrimaryText>doc</PrimaryText> quick link to open it in the editor.
      </div>
    </>
  )
}

export const FinishQuickLink = () => {
  const history = useHistory()

  const { closeOnboarding } = useOnboardingData()
  const { loadNode } = useLoad()
  const { getUidFromNodeId } = useLinks()

  const onClick = () => {
    const uid = getUidFromNodeId('Tour.Snippets')
    loadNode(uid, { fetch: false, savePrev: false })
    performClick()
  }

  return (
    <>
      <div>This is a quick link section. </div>
      <div>Here you&apos;ll see all othere nodes where this node is referenced.</div>
      <br />
      <br />
      <FlexBetween>
        <Button onClick={closeOnboarding}>Finish</Button>
        <Button onClick={onClick}>
          Next <PrimaryText>&quot;Snippets&quot;</PrimaryText>
        </Button>
      </FlexBetween>
    </>
  )
}

export default QuickLinkTour
