import React from 'react';
import { Link, useLocation, LinkProps } from 'react-router-dom';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { Music, List, BarChart2, Plus, X, Database } from 'lucide-react';

const SidebarContainer = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: ${props => props.theme.colors.secondary};
  border-right: 1px solid ${props => props.theme.colors.border};
  z-index: 10;
  transition: transform 0.3s ease;
  overflow-y: auto;
  transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  
  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    transform: none;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.space[4]};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.primary};
  font-weight: 700;
  font-size: ${props => props.theme.fontSizes.xl};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.mutedForeground};
  cursor: pointer;
  padding: ${props => props.theme.space[1]};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.foreground};
  }
  
  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    display: none;
  }
`;

const SidebarNav = styled.nav`
  padding: ${props => props.theme.space[4]};
`;

const NavCategory = styled.div`
  margin-bottom: ${props => props.theme.space[6]};
`;

const CategoryTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.mutedForeground};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: ${props => props.theme.space[3]};
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NavItem = styled.li`
  margin-bottom: ${props => props.theme.space[2]};
`;

interface StyledNavLinkProps extends LinkProps {
  $isActive: boolean;
}

// Fixed StyledNavLink to correctly handle props
const StyledNavLink = styled(({ $isActive, ...props }: StyledNavLinkProps) => <Link {...props} />)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.space[3]};
  color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.foreground};
  font-weight: ${props => props.$isActive ? '600' : '400'};
  border-radius: ${props => props.theme.radii.md};
  background-color: ${props => props.$isActive ? props.theme.colors.muted : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.muted};
    color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.foreground};
  }
  
  svg {
    margin-right: ${props => props.theme.space[3]};
  }
`;

const Backdrop = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9;
  opacity: ${props => props.$isOpen ? 1 : 0};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
  
  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    display: none;
  }
`;

const NavLinkWithActive = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <StyledNavLink to={to} $isActive={isActive}>
      {children}
    </StyledNavLink>
  );
};

const Sidebar: React.FC = () => {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  
  const closeMenu = () => {
    dispatch(toggleSidebar());
  };
  
  return (
    <>
      <SidebarContainer $isOpen={sidebarOpen}>
        <SidebarHeader>
          <Logo>
            <Music size={24} style={{ marginRight: '12px' }} />
            MusicApp
          </Logo>
          <CloseButton onClick={closeMenu}>
            <X size={20} />
          </CloseButton>
        </SidebarHeader>
        <SidebarNav>
          <NavCategory>
            <CategoryTitle>Music</CategoryTitle>
            <NavList>
              <NavItem>
                <NavLinkWithActive to="/">
                  <List size={18} />
                  All Songs
                </NavLinkWithActive>
              </NavItem>
              <NavItem>
                <NavLinkWithActive to="/player">
                  <Music size={18} />
                  Player
                </NavLinkWithActive>
              </NavItem>
              <NavItem>
                <NavLinkWithActive to="/dashboard">
                  <BarChart2 size={18} />
                  Dashboard
                </NavLinkWithActive>
              </NavItem>
            </NavList>
          </NavCategory>
          
          <NavCategory>
            <CategoryTitle>Manage</CategoryTitle>
            <NavList>
              <NavItem>
                <NavLinkWithActive to="/songs/add">
                  <Plus size={18} />
                  Add New Song
                </NavLinkWithActive>
              </NavItem>
              <NavItem>
                <NavLinkWithActive to="/lookups">
                  <Database size={18} />
                  Manage Lookups
                </NavLinkWithActive>
              </NavItem>
            </NavList>
          </NavCategory>
        </SidebarNav>
      </SidebarContainer>
      <Backdrop $isOpen={sidebarOpen} onClick={closeMenu} />
    </>
  );
};

export default Sidebar;
