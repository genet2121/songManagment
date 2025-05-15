
import styled from '@emotion/styled';
import {
  space,
  layout,
  color,
  flexbox,
  SpaceProps,
  LayoutProps,
  ColorProps,
  FlexboxProps,
} from 'styled-system';

type FlexProps = SpaceProps & LayoutProps & ColorProps & FlexboxProps;

export const Flex = styled.div<FlexProps>`
  display: flex;
  ${space}
  ${layout}
  ${color}
  ${flexbox}
`;

export const FlexColumn = styled(Flex)`
  flex-direction: column;
`;
