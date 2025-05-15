
import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: string;
      primaryLight: string;
      primaryDark: string;
      secondary: string;
      background: string;
      foreground: string;
      muted: string;
      mutedForeground: string;
      border: string;
      input: string;
      accent: string;
      error: string;
      success: string;
      warning: string;
    };
    fonts: {
      body: string;
      heading: string;
      mono: string;
    };
    fontSizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
    };
    space: {
      px: string;
      0.5: string;
      1: string;
      1.5: string;
      2: string;
      2.5: string;
      3: string;
      3.5: string;
      4: string;
      5: string;
      6: string;
      7: string;
      8: string;
      9: string;
      10: string;
      12: string;
      16: string;
      20: string;
      24: string;
      32: string;
      40: string;
      48: string;
      56: string;
      64: string;
    };
    radii: {
      none: string;
      sm: string;
      base: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      full: string;
    };
    shadows: {
      sm: string;
      base: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      inner: string;
      outline: string;
      none: string;
    };
    breakpoints: string[];
    zIndices: {
      hide: number;
      auto: string;
      base: number;
      docked: number;
      dropdown: number;
      sticky: number;
      banner: number;
      overlay: number;
      modal: number;
      popover: number;
      toast: number;
      tooltip: number;
    };
    transitions: {
      easeIn: string;
      easeOut: string;
      easeInOut: string;
      default: string;
    };
  }
}
