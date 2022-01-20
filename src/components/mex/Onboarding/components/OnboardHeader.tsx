import React from 'react'
import { SpaceBetweenHorizontalFlex } from '../../../../style/Layouts'

const OnboardHeader = ({ heading, closeTour }: { heading?: string; closeTour: any }) => {
  return (
    <SpaceBetweenHorizontalFlex id="tour-header">
      <SpaceBetweenHorizontalFlex>
        <div>
          <h6>{heading}</h6>
        </div>
      </SpaceBetweenHorizontalFlex>
      <h4 onClick={closeTour}>skip</h4>
    </SpaceBetweenHorizontalFlex>
  )
}

export default OnboardHeader
