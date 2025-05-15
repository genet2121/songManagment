
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchSongsRequest } from '../store/slices/songsSlice';
import { Container } from '../components/styled/Container';
import SongDetailComponent from '../components/Songs/SongDetail';
import Modal from '../components/UI/Modal';
import SongForm from '../components/Songs/SongForm';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import { deleteSongRequest } from '../store/slices/songsSlice';
import { closeModal } from '../store/slices/uiSlice';
import { Button } from '../components/styled/Button';
import { ArrowLeft } from 'lucide-react';
import styled from '@emotion/styled';

const BackButton = styled(Button)`
  margin-bottom: ${props => props.theme.space[4]};
`;

const NotFound = styled.div`
  text-align: center;
  padding: ${props => props.theme.space[8]};
`;

const NotFoundTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['3xl']};
  margin-bottom: ${props => props.theme.space[4]};
`;

const SongDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { songs } = useSelector((state: RootState) => state.songs);
  const { modalOpen, modalType, selectedSongId } = useSelector((state: RootState) => state.ui);
  
  useEffect(() => {
    if (songs.length === 0) {
      dispatch(fetchSongsRequest());
    }
  }, [dispatch, songs]);
  
  const song = songs.find(song => song.id === id);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleCloseModal = () => {
    dispatch(closeModal());
  };
  
  const handleDeleteConfirm = () => {
    if (selectedSongId) {
      dispatch(deleteSongRequest(selectedSongId));
      navigate('/');
    }
  };
  
  if (!song) {
    return (
      <Container py={6}>
        <BackButton variant="ghost" onClick={handleGoBack}>
          <ArrowLeft size={16} style={{ marginRight: '8px' }} />
          Back to songs
        </BackButton>
        
        <NotFound>
          <NotFoundTitle>Song not found</NotFoundTitle>
          <Button onClick={() => navigate('/')}>Return to song list</Button>
        </NotFound>
      </Container>
    );
  }
  
  return (
    <Container py={6}>
      <BackButton variant="ghost" onClick={handleGoBack}>
        <ArrowLeft size={16} style={{ marginRight: '8px' }} />
        Back to songs
      </BackButton>
      
      <SongDetailComponent song={song} />
      
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
        />
      )}
    </Container>
  );
};

export default SongDetailPage;
