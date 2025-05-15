
import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { X } from 'lucide-react';

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

// Adjust the ModalOverlay to receive isOpen as a prop, not from theme
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${props => props.theme.zIndices.modal};
  opacity: ${props => props.isOpen ? 1 : 0};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  transition: opacity 0.2s ease;
  padding: ${props => props.theme.space[4]};
`;

// Update ModalContainer to receive isOpen as a prop
const ModalContainer = styled.div<{ size: 'sm' | 'md' | 'lg' | 'xl'; isOpen: boolean }>`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.radii.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  width: 100%;
  max-width: ${props => {
    switch (props.size) {
      case 'sm': return '400px';
      case 'md': return '600px';
      case 'lg': return '800px';
      case 'xl': return '1000px';
      default: return '600px';
    }
  }};
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  transform: scale(${props => props.isOpen ? 1 : 0.9});
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: transform 0.2s ease, opacity 0.2s ease;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.space[4]} ${props => props.theme.space[4]};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: 600;
  margin: 0;
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
`;

const ModalBody = styled.div`
  padding: ${props => props.theme.space[4]} ${props => props.theme.space[4]};
`;

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children, size = 'md' }) => {
  if (!isOpen) return null;
  
  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer 
        size={size} 
        onClick={(e) => e.stopPropagation()} 
        isOpen={isOpen}
      >
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;
