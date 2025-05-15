
import React from 'react';
import styled from '@emotion/styled';
import { Flex } from '../styled/Flex';
import { Button } from '../styled/Button';

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: 'danger' | 'default';
};

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${props => props.theme.zIndices.modal};
`;

const DialogContent = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.radii.lg};
  padding: ${props => props.theme.space[6]};
  width: 90%;
  max-width: 500px;
  box-shadow: ${props => props.theme.shadows.lg};
`;

const DialogTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: 600;
  margin-bottom: ${props => props.theme.space[4]};
`;

const DialogMessage = styled.p`
  margin-bottom: ${props => props.theme.space[6]};
  color: ${props => props.theme.colors.mutedForeground};
`;

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'default',
}) => {
  return (
    <DialogOverlay onClick={onCancel}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogTitle>{title}</DialogTitle>
        <DialogMessage>{message}</DialogMessage>
        <Flex justifyContent="flex-end" gap={3}>
          <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'} 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {confirmLabel}
          </Button>
        </Flex>
      </DialogContent>
    </DialogOverlay>
  );
};

export default ConfirmDialog;
