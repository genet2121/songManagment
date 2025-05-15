
import styled from '@emotion/styled';
import { space, layout, color, SpaceProps, LayoutProps, ColorProps } from 'styled-system';

type ContainerProps = SpaceProps & LayoutProps & ColorProps & {
  fluid?: boolean;
};

export const Container = styled.div<ContainerProps>`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: ${props => props.theme.space[4]};
  padding-right: ${props => props.theme.space[4]};
  
  ${props => !props.fluid && `
    @media (min-width: ${props.theme.breakpoints[0]}) {
      max-width: 640px;
    }
    @media (min-width: ${props.theme.breakpoints[1]}) {
      max-width: 768px;
    }
    @media (min-width: ${props.theme.breakpoints[2]}) {
      max-width: 1024px;
    }
    @media (min-width: ${props.theme.breakpoints[3]}) {
      max-width: 1280px;
    }
  `}
  
  ${space}
  ${layout}
  ${color}
`;
