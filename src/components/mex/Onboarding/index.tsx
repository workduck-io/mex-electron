import React from 'react'
import { ReactourStep } from 'reactour'
import useOnboard from '../../../store/useOnboarding'
import { Button } from '../../../style/Buttons'
import { ReactTour } from './styled'

type OnboardingProps = {
  steps: Array<ReactourStep>
}

const OnBoardingTour: React.FC<OnboardingProps> = ({ steps }) => {
  const step = useOnboard((s) => s.step)

  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)

  return (
    <ReactTour
      closeWithMask={false}
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
      onRequestClose={() => changeOnboarding(false)}
      steps={steps}
      isOpen={isOnboarding}
    />
  )
}

export default OnBoardingTour
