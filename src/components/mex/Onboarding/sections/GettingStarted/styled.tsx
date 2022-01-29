import styled from 'styled-components'

export const Container = styled.section`
  padding: 4rem 10rem;
`

export const StyledList = styled.ul`
  margin: 2rem 1rem;
  padding-left: 2rem;
  li {
    margin: 0.25rem 0;
    padding: 1rem;
    border-radius: 0.5rem;
    font-size: 1.2rem;
    list-style: none;
    display: flex;
    align-items: center;
  }

  li:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.background.highlight};
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const StyledHeading = styled.h1`
  font-size: 3rem;
`
