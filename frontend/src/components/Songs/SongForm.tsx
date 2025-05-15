import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { addSongRequest, updateSongRequest } from '../../store/slices/songsSlice';
import { closeModal } from '../../store/slices/uiSlice';
import { RootState } from '../../store';
import { Song, SongFormData } from '../../types/song.types';
import { Music, Upload, X, Loader2 } from 'lucide-react';
import { FormGroup, FormLabel, Input, Select, FormHelperText } from '../styled/Input';
import { Button } from '../styled/Button';
import { Flex } from '../styled/Flex';
import { useLookupData } from '../../hooks/useLookupData';

type SongFormProps = {
  editMode?: boolean;
  songId?: string;
  onClose?: () => void;
};

const Form = styled.form`
  width: 100%;
  max-width: 600px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label<{ isDragOver?: boolean; hasFile?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 120px;
  border: 2px dashed ${props => 
    props.isDragOver 
      ? props.theme.colors.primary 
      : props.hasFile 
        ? props.theme.colors.success 
        : props.theme.colors.border};
  border-radius: ${props => props.theme.radii.md};
  background-color: ${props => 
    props.isDragOver 
      ? `${props.theme.colors.primary}11`
      : props.hasFile
        ? `${props.theme.colors.success}11`
        : props.theme.colors.muted};
  cursor: pointer;
  padding: ${props => props.theme.space[4]};
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => `${props.theme.colors.primary}11`};
  }
`;

const FileInputText = styled.span`
  margin-top: ${props => props.theme.space[2]};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.mutedForeground};
`;

const FilePreview = styled.div`
  position: relative;
  margin-top: ${props => props.theme.space[2]};
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: ${props => props.theme.radii.md};
`;

const AudioPreview = styled.audio`
  width: 100%;
  margin-top: ${props => props.theme.space[2]};
`;

const RemoveButton = styled.button`
  position: absolute;
  top: ${props => props.theme.space[2]};
  right: ${props => props.theme.space[2]};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
  }
`;

const FileName = styled.div`
  margin-top: ${props => props.theme.space[2]};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.mutedForeground};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: ${props => props.theme.space[2]};
  }
`;

const ErrorText = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSizes.sm};
`;

// Genre options
const genres = [
  'Pop',
  'Rock',
  'Hip Hop',
  'R&B',
  'Country',
  'Jazz',
  'Classical',
  'Electronic',
  'Folk',
  'Reggae',
  'Blues',
  'Metal',
];

const initialFormState: SongFormData = {
  title: '',
  artist: '',
  genre: '',
  album: '',
  image: null,
  audio: null,
};

const SongForm: React.FC<SongFormProps> = ({ editMode = false, songId, onClose }) => {
  const [formData, setFormData] = useState<SongFormData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageDragOver, setImageDragOver] = useState<boolean>(false);
  const [audioDragOver, setAudioDragOver] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  
  const dispatch = useDispatch();
  const { songs, loading } = useSelector((state: RootState) => state.songs);
  
  // Get lookup data for dropdowns
  const { artists, genres, albums, loading: lookupLoading, error: lookupError } = useLookupData();
  
  // If in edit mode, populate the form with song data
  useEffect(() => {
    if (editMode && songId) {
      const songToEdit = songs.find((song: Song) => song.id === songId);
      if (songToEdit) {
        setFormData({
          title: songToEdit.title,
          artist: songToEdit.artist,
          genre: songToEdit.genre,
          album: songToEdit.album,
          image: null,
          audio: null,
          imageUrl: songToEdit.imageUrl,
          audioUrl: songToEdit.audioUrl,
        });
        
        if (songToEdit.imageUrl) {
          setImagePreview(songToEdit.imageUrl);
        }
        
        if (songToEdit.audioUrl) {
          setAudioPreview(songToEdit.audioUrl);
        }
      }
    }
  }, [editMode, songId, songs]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (!selectedFile.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, image: selectedFile }));
      setImagePreview(URL.createObjectURL(selectedFile));
      
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };
  
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (!selectedFile.type.startsWith('audio/')) {
        setErrors(prev => ({ ...prev, audio: 'Please select an audio file' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, audio: selectedFile }));
      setAudioPreview(URL.createObjectURL(selectedFile));
      
      if (errors.audio) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.audio;
          return newErrors;
        });
      }
    }
  };
  
  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setImageDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (!droppedFile.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please drop an image file' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, image: droppedFile }));
      setImagePreview(URL.createObjectURL(droppedFile));
      
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };
  
  const handleAudioDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setAudioDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (!droppedFile.type.startsWith('audio/')) {
        setErrors(prev => ({ ...prev, audio: 'Please drop an audio file' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, audio: droppedFile }));
      setAudioPreview(URL.createObjectURL(droppedFile));
      
      if (errors.audio) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.audio;
          return newErrors;
        });
      }
    }
  };
  
  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null, imageUrl: undefined }));
    setImagePreview(null);
  };
  
  const removeAudio = () => {
    setFormData(prev => ({ ...prev, audio: null, audioUrl: undefined }));
    setAudioPreview(null);
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist is required';
    }
    
    if (!formData.genre) {
      newErrors.genre = 'Genre is required';
    }
    
    if (!formData.album.trim()) {
      newErrors.album = 'Album name is required';
    }
    
    if (!editMode && !formData.image && !formData.imageUrl) {
      newErrors.image = 'Song image is required';
    }
    
    if (!editMode && !formData.audio && !formData.audioUrl) {
      newErrors.audio = 'Song audio file is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // We'll let the API handle the file uploads
    const songData: SongFormData = {
      ...formData
    };
    
    if (editMode && songId) {
      dispatch(updateSongRequest({ id: songId, data: songData }));
    } else {
      dispatch(addSongRequest(songData));
    }
    
    // Clear form
    setFormData(initialFormState);
    setImagePreview(null);
    setAudioPreview(null);
    
    // Close modal if function is provided
    if (onClose) {
      onClose();
    } else if (editMode) {
      dispatch(closeModal());
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <FormLabel htmlFor="title">Song Title</FormLabel>
        <Input
          type="text"
          id="title"
          name="title"
          placeholder="Enter song title"
          value={formData.title}
          onChange={handleInputChange}
          error={!!errors.title}
        />
        {errors.title && <FormHelperText error>{errors.title}</FormHelperText>}
      </FormGroup>
      
      <FormGroup>
        <FormLabel htmlFor="artist">Artist</FormLabel>
        {lookupLoading ? (
          <Flex alignItems="center" gap={2}>
            <Loader2 size={16} className="animate-spin" />
            <span>Loading artists...</span>
          </Flex>
        ) : (
          <Select
            id="artist"
            name="artist"
            value={formData.artist}
            onChange={handleInputChange}
            error={!!errors.artist}
          >
            <option value="">Select an artist</option>
            {artists.map(artist => (
              <option key={artist.id} value={artist.id}>{artist.value}</option>
            ))}
          </Select>
        )}
        {errors.artist && <FormHelperText error>{errors.artist}</FormHelperText>}
      </FormGroup>
      
      <FormGroup>
        <FormLabel htmlFor="genre">Genre</FormLabel>
        {lookupLoading ? (
          <Flex alignItems="center" gap={2}>
            <Loader2 size={16} className="animate-spin" />
            <span>Loading genres...</span>
          </Flex>
        ) : (
          <Select
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            error={!!errors.genre}
          >
            <option value="">Select a genre</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.value}</option>
            ))}
          </Select>
        )}
        {errors.genre && <FormHelperText error>{errors.genre}</FormHelperText>}
      </FormGroup>
      
      <FormGroup>
        <FormLabel htmlFor="album">Album</FormLabel>
        {lookupLoading ? (
          <Flex alignItems="center" gap={2}>
            <Loader2 size={16} className="animate-spin" />
            <span>Loading albums...</span>
          </Flex>
        ) : (
          <Select
            id="album"
            name="album"
            value={formData.album}
            onChange={handleInputChange}
            error={!!errors.album}
          >
            <option value="">Select an album</option>
            {albums.map(album => (
              <option key={album.id} value={album.id}>{album.value}</option>
            ))}
          </Select>
        )}
        {errors.album && <FormHelperText error>{errors.album}</FormHelperText>}
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Song Image</FormLabel>
        <FileInputLabel
          htmlFor="image"
          isDragOver={imageDragOver}
          hasFile={!!imagePreview}
          onDragOver={(e) => {
            e.preventDefault();
            setImageDragOver(true);
          }}
          onDragLeave={() => setImageDragOver(false)}
          onDrop={handleImageDrop}
        >
          <Upload size={24} color={imagePreview ? '#10B981' : undefined} />
          <FileInputText>
            {imagePreview ? 'Image uploaded' : 'Click or drag and drop to upload image'}
          </FileInputText>
        </FileInputLabel>
        <FileInput
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        {errors.image && <FormHelperText error>{errors.image}</FormHelperText>}
        
        {imagePreview && (
          <FilePreview>
            <PreviewImage src={imagePreview} alt="Song cover preview" />
            <RemoveButton type="button" onClick={removeImage}>
              <X size={14} />
            </RemoveButton>
          </FilePreview>
        )}
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Song Audio File</FormLabel>
        <FileInputLabel
          htmlFor="audio"
          isDragOver={audioDragOver}
          hasFile={!!audioPreview}
          onDragOver={(e) => {
            e.preventDefault();
            setAudioDragOver(true);
          }}
          onDragLeave={() => setAudioDragOver(false)}
          onDrop={handleAudioDrop}
        >
          <Music size={24} color={audioPreview ? '#10B981' : undefined} />
          <FileInputText>
            {audioPreview ? 'Audio uploaded' : 'Click or drag and drop to upload audio'}
          </FileInputText>
        </FileInputLabel>
        <FileInput
          type="file"
          id="audio"
          accept="audio/*"
          onChange={handleAudioChange}
        />
        {errors.audio && <FormHelperText error>{errors.audio}</FormHelperText>}
        
        {audioPreview && (
          <>
            <AudioPreview controls src={audioPreview} />
            <Flex justifyContent="flex-end">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={removeAudio}
                style={{ marginTop: '8px' }}
              >
                Remove Audio
              </Button>
            </Flex>
          </>
        )}
      </FormGroup>
      
      <Flex justifyContent="flex-end" mt={4}>
        {onClose && (
          <Button type="button" variant="ghost" onClick={onClose} mr={2}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading || lookupLoading}>
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              {editMode ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            editMode ? 'Update Song' : 'Add Song'
          )}
        </Button>
      </Flex>
      
      {lookupError && (
        <FormHelperText error style={{ marginTop: '16px', textAlign: 'center' }}>
          Error loading reference data: {lookupError}
        </FormHelperText>
      )}
    </Form>
  );
};

export default SongForm;
