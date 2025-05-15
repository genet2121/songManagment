
import styled from '@emotion/styled';
import {
  space,
  layout,
  typography,
  border,
  SpaceProps,
  LayoutProps,
  TypographyProps,
  BorderProps,
} from 'styled-system';

type InputProps = SpaceProps & LayoutProps & TypographyProps & BorderProps & {
  error?: boolean;
};

export const Input = styled.input<InputProps>`
  width: 100%;
  height: 40px;
  padding: 0 ${props => props.theme.space[3]};
  background-color: ${props => props.theme.colors.muted};
  color: ${props => props.theme.colors.foreground};
  border: 1px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.radii.md};
  font-size: ${props => props.theme.fontSizes.sm};
  transition: ${props => props.theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}33`};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.mutedForeground};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${space}
  ${layout}
  ${typography}
  ${border}
`;

export const Textarea = styled.textarea<InputProps>`
  width: 100%;
  padding: ${props => props.theme.space[3]};
  background-color: ${props => props.theme.colors.muted};
  color: ${props => props.theme.colors.foreground};
  border: 1px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.radii.md};
  font-size: ${props => props.theme.fontSizes.sm};
  transition: ${props => props.theme.transitions.default};
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}33`};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.mutedForeground};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${space}
  ${layout}
  ${typography}
  ${border}
`;

export const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.space[4]};
`;

export const FormLabel = styled.label`
  display: block;
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 500;
  margin-bottom: ${props => props.theme.space[2]};
`;

export const FormHelperText = styled.p<{ error?: boolean }>`
  margin-top: ${props => props.theme.space[1]};
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.error ? props.theme.colors.error : props.theme.colors.mutedForeground};
`;

export const Select = styled.select<InputProps>`
  width: 100%;
  height: 40px;
  padding: 0 ${props => props.theme.space[3]};
  background-color: ${props => props.theme.colors.muted};
  color: ${props => props.theme.colors.foreground};
  border: 1px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.radii.md};
  font-size: ${props => props.theme.fontSizes.sm};
  transition: ${props => props.theme.transitions.default};
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23A1A1AA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>');
  background-repeat: no-repeat;
  background-position: right ${props => props.theme.space[3]} center;
  background-size: 16px 16px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}33`};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${space}
  ${layout}
  ${typography}
  ${border}
`;
