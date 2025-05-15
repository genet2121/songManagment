
import styled from '@emotion/styled';
import {
  space,
  layout,
  color,
  typography,
  variant,
  SpaceProps,
  LayoutProps,
  ColorProps,
  TypographyProps,
} from 'styled-system';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = SpaceProps & 
  LayoutProps & 
  ColorProps & 
  TypographyProps & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
  };

export const Button = styled.button<ButtonProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.radii.md};
  font-weight: 500;
  transition: ${props => props.theme.transitions.default};
  cursor: pointer;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${variant({
    variants: {
      primary: {
        bg: 'primary',
        color: 'foreground',
        border: 'none',
        '&:hover:not(:disabled)': {
          bg: 'primaryLight',
        },
        '&:active:not(:disabled)': {
          bg: 'primaryDark',
        },
      },
      secondary: {
        bg: 'secondary',
        color: 'foreground',
        border: 'none',
        '&:hover:not(:disabled)': {
          bg: 'muted',
        },
      },
      outline: {
        bg: 'transparent',
        color: 'primary',
        border: '1px solid',
        borderColor: 'primary',
        '&:hover:not(:disabled)': {
          bg: 'primary',
          color: 'foreground',
        },
      },
      ghost: {
        bg: 'transparent',
        color: 'foreground',
        border: 'none',
        '&:hover:not(:disabled)': {
          bg: 'muted',
        },
      },
      link: {
        bg: 'transparent',
        color: 'primary',
        border: 'none',
        padding: '0',
        height: 'auto',
        '&:hover:not(:disabled)': {
          textDecoration: 'underline',
        },
      },
      danger: {
        bg: 'error',
        color: 'foreground',
        border: 'none',
        '&:hover:not(:disabled)': {
          opacity: 0.9,
        },
      },
    },
  })}
  
  ${variant({
    prop: 'size',
    variants: {
      sm: {
        fontSize: 'xs',
        paddingX: 3,
        paddingY: 1,
        height: '32px',
      },
      md: {
        fontSize: 'sm',
        paddingX: 4,
        paddingY: 2,
        height: '40px',
      },
      lg: {
        fontSize: 'md',
        paddingX: 6,
        paddingY: 3,
        height: '48px',
      },
    },
  })}
  
  ${space}
  ${layout}
  ${color}
  ${typography}
`;

Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  type: 'button',
};
