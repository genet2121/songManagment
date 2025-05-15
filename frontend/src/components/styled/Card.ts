
import styled from '@emotion/styled';
import { space, layout, border, shadow, SpaceProps, LayoutProps, BorderProps, ShadowProps } from 'styled-system';

type CardProps = SpaceProps & LayoutProps & BorderProps & ShadowProps & {
  interactive?: boolean;
};

export const Card = styled.div<CardProps>`
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.radii.lg};
  padding: ${props => props.theme.space[4]};
  transition: ${props => props.theme.transitions.default};
  
  ${props => props.interactive && `
    cursor: pointer;
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.md};
    }
  `}
  
  ${space}
  ${layout}
  ${border}
  ${shadow}
`;

export const CardHeader = styled.div`
  margin-bottom: ${props => props.theme.space[4]};
`;

export const CardTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: 600;
  margin-bottom: ${props => props.theme.space[1]};
`;

export const CardDescription = styled.p`
  color: ${props => props.theme.colors.mutedForeground};
  font-size: ${props => props.theme.fontSizes.sm};
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${props => props.theme.space[4]};
  padding-top: ${props => props.theme.space[4]};
  border-top: 1px solid ${props => props.theme.colors.border};
`;
