// import original module declarations
import 'styled-components';

interface BorderStyle {
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
    nav: string;
  };
}

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends BorderStyle {
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
        disabled: string;
      };
    };
  }
}
