import React from 'react'
import { Button } from '../../Styled/Buttons'
import useOnboard from './store'
import { ReactTour } from './styled'

const OnBoardingTour = ({ steps }: { steps: Array<any> }) => {
  const isOnboarding = useOnboard((s) => s.isOnboarding)
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
      isOpen={isOnboarding}
    />
  )
}

export default OnBoardingTour
