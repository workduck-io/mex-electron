import React, { useEffect } from 'react'
import { ReactourStep } from 'reactour'
import { mog } from '../../../utils/lib/helper'
import useOnboard from '../../../store/useOnboarding'
import { Button } from '../../../style/Buttons'
import { ReactTour } from './styled'
import { useOnboardingData } from './hooks'
import { useTheme } from 'styled-components'

type OnboardingProps = {
  steps: Array<ReactourStep>
}

const OnBoardingTour: React.FC<OnboardingProps> = ({ steps }) => {
  const step = useOnboard((s) => s.step)
  const isOnboarding = useOnboard((s) => s.isOnboarding)

  const theme = useTheme()

  const { closeOnboarding } = useOnboardingData()

  useEffect(() => mog('Onboarding stats', { step, isOnboarding }), [step, isOnboarding])

  return (
    <ReactTour
      closeWithMask={false}
      accentColor={theme.colors.primary}
      showCloseButton={false}
      prevButton={<></>}
      nextButton={
        <Button tabIndex={-1} id="tour-next-button" color="primary">
          Next
        </Button>
      }
      startAt={step}
      disableDotsNavigation
      showNavigation={false}
      rounded={5}
      disableFocusLock
      disableInteraction
      onRequestClose={closeOnboarding}
      steps={steps}
      isOpen={isOnboarding}
    />
  )
}

export default OnBoardingTour
