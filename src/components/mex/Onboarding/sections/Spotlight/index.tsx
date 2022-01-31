import React from 'react'
import { PrimaryText } from '../../../../../style/Integration'

const SpotlightFinishTour = () => {
  return (
    <>
      <div>By default your captured content would be saved in Drafts.</div>
      <br />
      <div>
        For now, let&apos;s add this content to some existing node (say <PrimaryText>doc</PrimaryText>).
      </div>
      <br />
      Save this content to <PrimaryText>&quot;doc&quot;</PrimaryText> by searching <PrimaryText>doc</PrimaryText> and
      hitting enter from the list.
      <div>
        It saves your content in <PrimaryText>doc</PrimaryText> node first and then closes .
      </div>
    </>
  )
}

export default SpotlightFinishTour
