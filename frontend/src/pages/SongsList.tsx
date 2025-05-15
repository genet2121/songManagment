
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchSongsRequest } from '../store/slices/songsSlice';
import { openModal } from '../store/slices/uiSlice';
import { Container } from '../components/styled/Container';
import { Title, Subtitle } from '../components/styled/Typography';
import { Button } from '../components/styled/Button';
import { Flex } from '../components/styled/Flex';
import SongList from '../components/Songs/SongList';
import Modal from '../components/UI/Modal';
import SongForm from '../components/Songs/SongForm';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import { deleteSongRequest } from '../store/slices/songsSlice';
import { closeModal } from '../store/slices/uiSlice';
import { Plus } from 'lucide-react';

const SongsListPage: React.FC = () => {
  const dispatch = useDispatch();
  const { songs, loading } = useSelector((state: RootState) => state.songs);
  const { modalOpen, modalType, selectedSongId } = useSelector((state: RootState) => state.ui);
  
  useEffect(() => {
    dispatch(fetchSongsRequest());
  }, [dispatch]);
  
  const handleAddSong = () => {
    dispatch(openModal({ type: 'add' }));
  };
  
  const handleCloseModal = () => {
    dispatch(closeModal());
  };
  
  const handleDeleteConfirm = () => {
    if (selectedSongId) {
      dispatch(deleteSongRequest(selectedSongId));
    }
  };
  
  return (
    <Container py={6}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <div>
          <Title>All Songs</Title>
          <Subtitle>Manage your music collection</Subtitle>
        </div>
        
        <Button onClick={handleAddSong}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Add New Song
        </Button>
      </Flex>
      
      <SongList />
      
      {/* Add Song Modal */}
      <Modal 
        isOpen={modalOpen && modalType === 'add'} 
        onClose={handleCloseModal}
        title="Add New Song"
        size="md"
      >
        <SongForm onClose={handleCloseModal} />
      </Modal>
      
      {/* Edit Song Modal */}
      <Modal 
        isOpen={modalOpen && modalType === 'edit'} 
        onClose={handleCloseModal}
        title="Edit Song"
        size="md"
      >
        <SongForm editMode songId={selectedSongId || ''} onClose={handleCloseModal} />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      {modalOpen && modalType === 'delete' && selectedSongId && (
        <ConfirmDialog
          title="Delete Song"
          message="Are you sure you want to delete this song? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={handleCloseModal}
          variant="danger"
          isLoading={loading}
        />
      )}
    </Container>
  );
};

export default SongsListPage;
