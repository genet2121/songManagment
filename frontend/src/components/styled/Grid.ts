
import styled from '@emotion/styled';
import {
  grid,
  space,
  layout,
  color,
  GridProps as StyledGridProps,
  SpaceProps,
  LayoutProps,
  ColorProps,
} from 'styled-system';

type GridProps = StyledGridProps & SpaceProps & LayoutProps & ColorProps;

export const Grid = styled.div<GridProps>`
  display: grid;
  ${grid}
  ${space}
  ${layout}
  ${color}
`;
