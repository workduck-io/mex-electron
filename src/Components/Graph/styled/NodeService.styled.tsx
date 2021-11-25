import styled from 'styled-components'

export const NodeServiceContainer = styled.section`
  display: flex;
  margin: 3rem 1rem;
  position: absolute;
  bottom: 0;
  left: 2;
  width: 95%;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[9]};
  padding: ${({ theme }) => `${theme.spacing.tiny}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`
export const ServiceIconMargin = styled.div`
  margin: 0.2rem;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  margin-right: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};

  :hover {
    background-color: ${({ theme }) => theme.colors.background.highlight};
  }
`
