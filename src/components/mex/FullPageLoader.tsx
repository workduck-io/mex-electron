import React from 'react'
import styled from 'styled-components'
import { ModalStyles } from './Refactor/styles'
import Lottie from 'lottie-react'
import { loader } from '@components/spotlight/ActionStage/Performers/loader'

const OverlayLoader = styled.div`
  ${ModalStyles}
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    height: 25rem !important;
    width: 25rem !important;
  }
`

const FullPageLoader = () => {
  return (
    <OverlayLoader>
      <Lottie autoplay loop animationData={loader} />
    </OverlayLoader>
  )
}

export default FullPageLoader
