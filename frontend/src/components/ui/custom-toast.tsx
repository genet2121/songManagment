import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { hideToast } from '../../store/slices/uiSlice';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

const ToastContainer = styled.div<{ show: boolean; type: 'success' | 'error' | 'info' }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 450px;
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.foreground};
  padding: ${props => props.theme.space[4]};
  border-radius: ${props => props.theme.radii.md};
  box-shadow: ${props => props.theme.shadows.lg};
  display: flex;
  align-items: flex-start;
  transform: ${props => props.show ? 'translateY(0)' : 'translateY(100%)'};
  opacity: ${props => props.show ? 1 : 0};
  transition: all 0.3s ease;
  z-index: ${props => props.theme.zIndices.toast};
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'success':
        return props.theme.colors.success;
      case 'error':
        return props.theme.colors.error;
      default:
        return props.theme.colors.primary;
    }
  }};
`;

const IconWrapper = styled.div<{ type: 'success' | 'error' | 'info' }>`
  margin-right: ${props => props.theme.space[3]};
  color: ${props => {
    switch (props.type) {
      case 'success':
        return props.theme.colors.success;
      case 'error':
        return props.theme.colors.error;
      default:
        return props.theme.colors.primary;
    }
  }};
  flex-shrink: 0;
`;

const ToastContent = styled.div`
  flex: 1;
`;

const ToastMessage = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.sm};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.mutedForeground};
  cursor: pointer;
  padding: ${props => props.theme.space[1]};
  margin-left: ${props => props.theme.space[2]};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    color: ${props => props.theme.colors.foreground};
  }
`;

const Toast: React.FC = () => {
  const { toast } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [toast.show, dispatch]);
  
  const handleClose = () => {
    dispatch(hideToast());
  };
  
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };
  
  return (
    <ToastContainer show={toast.show} type={toast.type}>
      <IconWrapper type={toast.type}>
        {getIcon()}
      </IconWrapper>
      <ToastContent>
        <ToastMessage>{toast.message}</ToastMessage>
      </ToastContent>
      <CloseButton onClick={handleClose}>
        <X size={16} />
      </CloseButton>
    </ToastContainer>
  );
};

export default Toast;
