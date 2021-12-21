import Tour from 'reactour'
import styled from 'styled-components'

export const ReactTour = styled(Tour)`
  &.reactour__helper {
    max-width: 40vw;
    min-width: 100px;
  }

  #tour-body {
    user-select: none;
  }
`
