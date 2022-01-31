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
import { Button } from '../../../../../style/Buttons'

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
        &nbsp;command
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
      <div>This is a Quick links section. </div>
      <div>It shows all the nodes where current node is referenced.</div>
      <br />
      <div>
        For example, <PrimaryText>Tour.Quick Links</PrimaryText> is using <PrimaryText>doc</PrimaryText> somewhere in
        it&apos;s content.
      </div>
      <br />
      <FlexBetween>
        <Button onClick={closeOnboarding}>Finish</Button>
        <Button onClick={onClick}>
          Next&nbsp;&nbsp;<PrimaryText>&quot;Snippets&quot;</PrimaryText>
        </Button>
      </FlexBetween>
    </>
  )
}

export default QuickLinkTour
