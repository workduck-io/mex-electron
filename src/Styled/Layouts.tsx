import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  margin: ${({ theme }) => theme.spacing.large};
  width: 100%;
`

export const centeredCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Centered = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

export const CenteredColumn = styled(Centered)`
  flex-direction: column;
`

export const SpaceBetweenHorizontalFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export default Centered
