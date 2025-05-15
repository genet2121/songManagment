
import { css, Global } from '@emotion/react';
import { Theme } from '@emotion/react';
import React from 'react';

const globalStyles = (theme: Theme) => css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    font-family: ${theme.fonts.body};
    background-color: ${theme.colors.background};
    color: ${theme.colors.foreground};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #root {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: ${theme.transitions.default};
    
    &:hover {
      color: ${theme.colors.primaryLight};
    }
  }
  
  button {
    cursor: pointer;
  }
  
  input, button, textarea, select {
    font-family: inherit;
  }
`;

export const GlobalStyles: React.FC = () => {
  return React.createElement(Global, { styles: globalStyles });
};
