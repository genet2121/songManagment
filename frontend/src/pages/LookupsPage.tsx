
import React, { useState } from 'react';
import { Container } from '../components/styled/Container';
import { Title, Subtitle } from '../components/styled/Typography';
import { Flex } from '../components/styled/Flex';
import { Button } from '../components/styled/Button';
import { Card } from '../components/styled/Card';
import LookupList from '../components/Lookups/LookupList';
import LookupForm from '../components/Lookups/LookupForm';
import Modal from '../components/UI/Modal';
import { Plus } from 'lucide-react';
import { Lookup } from '../store/slices/lookupSlice';
import styled from '@emotion/styled';

const FormCard = styled(Card)`
  padding: ${props => props.theme.space[6]};
  margin-bottom: ${props => props.theme.space[6]};
`;

const LookupsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentLookup, setCurrentLookup] = useState<Lookup | null>(null);
  
  const handleAddNewClick = () => {
    setEditMode(false);
    setCurrentLookup(null);
    setIsModalOpen(true);
  };
  
  const handleEditLookup = (lookup: Lookup) => {
    setEditMode(true);
    setCurrentLookup(lookup);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentLookup(null);
  };
  
  return (
    <Container py={6}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <div>
          <Title>Manage Lookups</Title>
          <Subtitle>Add, edit, or remove lookup values for artists, genres, and albums</Subtitle>
        </div>
        
        <Button onClick={handleAddNewClick}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Add New Lookup
        </Button>
      </Flex>
      
      <LookupList onEdit={handleEditLookup} />
      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editMode ? "Edit Lookup" : "Add New Lookup"}
        size="md"
      >
        <LookupForm
          editMode={editMode}
          lookupId={currentLookup?._id}
          initialCategory={currentLookup?.category || ''}
          initialValue={currentLookup?.value || ''}
          onClose={handleCloseModal}
        />
      </Modal>
    </Container>
  );
};

export default LookupsPage;
