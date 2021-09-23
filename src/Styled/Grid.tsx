import { animated } from 'react-spring'
import styled, { css } from 'styled-components'
import { size } from './responsive'

// interface GridProps {
//   showGraph: boolean
//   sidebarWidth: number
// }

export const GridWrapper = styled(animated.div)`
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 64px 2fr auto;
  /* grid-gap: ${({ theme }) => theme.spacing.tiny}; */

  /* Columns conditions
    - Small - no graph
    - large - graph, no graph
  */
`
