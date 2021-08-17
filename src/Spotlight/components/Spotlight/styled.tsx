import styled, { css } from 'styled-components';

export const Anything = ``;

export const StyledLookup = styled.div`
  padding: 10px;
  display: flex;
  width: 97.1%;
  height: 95vh;
  color: ${({ theme }) => theme.colors.text.primary};
  overflow: hidden;
  flex-direction: column;
`;

export const StyledBackground = css`
  background-color: ${({ theme }) => theme.colors.background.spotlight};
`;
