import { animated } from 'react-spring'
import styled from 'styled-components'

// interface GridProps {
//   showGraph: boolean
//   sidebarWidth: number
// }

export const GridWrapper = styled(animated.div)`
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: ${({ theme }) => theme.width.nav}px 2fr auto;
  overflow: auto;
  /* grid-gap: ${({ theme }) => theme.spacing.tiny}; */

  /* Columns conditions
    - Small - no graph
    - large - graph, no graph
  */
`
