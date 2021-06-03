// import original module declarations
import 'styled-components';

type Pixels = number; // Pixels in integer

interface LayoutStyle {
  spacing: {
    large: string;
    medium: string;
    small: string;
    tiny: string;
  };
  borderRadius: {
    large: string;
    small: string;
  };
  width: {
    nav: Pixels;
    sidebar: Pixels;
  };
  indent: { sidebar: Pixels };
}

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends LayoutStyle {
    colors: {
      primary: string;
      secondary: string;
      background: {
        app: string;
        card: string;
        surface: string;
        sidebar: string;
      };
      palette: {
        green: string;
        yellow: string;
        red: string;
      };
      gray: {
        light: string;
        gray: string;
        dark: string;
      };
      border: {
        divider: string;
      };
      fade: {
        primary: string;
        secondary: string;
        background: string;
      };
      text: {
        primary: string;
        secondary: string;
        default: string;
        disabled: string;
        accent: string;
      };
    };
  }
}
