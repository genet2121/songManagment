
import styled from '@emotion/styled';
import {
  typography,
  space,
  color,
  TypographyProps as StyledTypographyProps,
  SpaceProps,
  ColorProps,
} from 'styled-system';

type TypographyProps = StyledTypographyProps & SpaceProps & ColorProps;

export const Text = styled.p<TypographyProps>`
  ${typography}
  ${space}
  ${color}
`;

export const Heading = styled.h1<TypographyProps>`
  font-family: ${props => props.theme.fonts.heading};
  line-height: 1.2;
  font-weight: 600;
  ${typography}
  ${space}
  ${color}
`;

export const Title = styled(Heading)`
  font-size: ${props => props.theme.fontSizes['3xl']};
  margin-bottom: ${props => props.theme.space[6]};
  
  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    font-size: ${props => props.theme.fontSizes['4xl']};
  }
`;

export const Subtitle = styled.h3<TypographyProps>`
  font-family: ${props => props.theme.fonts.heading};
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.mutedForeground};
  margin-bottom: ${props => props.theme.space[4]};
  
  ${typography}
  ${space}
  ${color}
`;
