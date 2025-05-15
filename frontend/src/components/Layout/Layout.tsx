import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import theme from '../../styles/theme';
import { GlobalStyles } from '../../styles/GlobalStyles';
import Sidebar from './Sidebar';
import Player from '../Player/Player';
import Toast from '../ui/custom-toast';

type LayoutProps = {
  children: ReactNode;
};

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.div<{ sidebarOpen: boolean }>`
  display: flex;
  flex: 1;
`;

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.space[4]};
  transition: margin-left 0.3s ease;
  
  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    margin-left: ${props => props.sidebarOpen ? '250px' : '0'};
  }
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { currentSong } = useSelector((state: RootState) => state.player);
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <LayoutContainer>
        <ContentWrapper sidebarOpen={sidebarOpen}>
          <Sidebar />
          <MainContent sidebarOpen={sidebarOpen}>
            {children}
          </MainContent>
        </ContentWrapper>
        {currentSong && <Player />}
        <Toast />
      </LayoutContainer>
    </ThemeProvider>
  );
};

export default Layout;
