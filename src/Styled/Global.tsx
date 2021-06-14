import { createGlobalStyle } from 'styled-components';
import { ThinScrollbar } from './helpers';
import { LookupStyles } from '../Components/Lookup';
import normalize from './normalize';

const GlobalStyle = createGlobalStyle`
  ${normalize}; // NormalizeCSS normalization

  body {
    min-height: 100vh;
    display: flex;
    font-family: Inter, sans-serif;
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background.app};
    
    ${ThinScrollbar};
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};

    &:hover {
      text-decoration: underline;
      text-decoration-color: ${({ theme }) => theme.colors.primary};
    }
  }

  #root {
    width: 100%;
  }
  
  ${LookupStyles};
`;

export default GlobalStyle;
