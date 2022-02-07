import React from 'react'
import useOnboard from '../../../store/useOnboarding'
import { Button } from '../../../style/Buttons'
import { ReactTour } from './styled'

const OnBoardingTour = ({ steps }: { steps: Array<any> }) => {
  const step = useOnboard((s) => s.step)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)

  return (
    <ReactTour
      showCloseButton={false}
      prevButton={<></>}
      nextButton={
        <Button tabIndex={-1} id="tour-next-button" color="primary">
          Next
        </Button>
      }
      startAt={step}
      disableDotsNavigation
      rounded={5}
      disableFocusLock
      disableInteraction
      onRequestClose={() => changeOnboarding(false)}
      steps={steps}
      isOpen={false}
    />
  )
}

export default OnBoardingTour
