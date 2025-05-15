
import React from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCurrentSong } from '../../store/slices/playerSlice';
import { openModal } from '../../store/slices/uiSlice';
import { Song } from '../../types/song.types';
import { Play, Edit, Trash2, Clock, Music, AlbumIcon } from 'lucide-react';
import { Button } from '../styled/Button';
import { Flex, FlexColumn } from '../styled/Flex';
import { Title, Text } from '../styled/Typography';
import { formatDistanceToNow } from 'date-fns';

type SongDetailProps = {
  song: Song;
};

const DetailContainer = styled(Flex)`
  margin-bottom: ${props => props.theme.space[6]};
  flex-direction: column;
  
  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    flex-direction: row;
  }
`;

const CoverArt = styled.div`
  width: 100%;
  margin-bottom: ${props => props.theme.space[4]};
  
  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    width: 300px;
    margin-right: ${props => props.theme.space[6]};
    margin-bottom: 0;
  }
  
  img {
    width: 100%;
    height: auto;
    border-radius: ${props => props.theme.radii.md};
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const SongInfo = styled(FlexColumn)`
  flex: 1;
  justify-content: space-between;
`;

const SongTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes['4xl']};
  font-weight: 700;
  margin-bottom: ${props => props.theme.space[2]};
`;

const Artist = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  color: ${props => props.theme.colors.mutedForeground};
  margin-bottom: ${props => props.theme.space[4]};
`;

const Genre = styled.span`
  display: inline-block;
  background-color: ${props => `${props.theme.colors.primary}22`};
  color: ${props => props.theme.colors.primary};
  padding: ${props => `${props.theme.space[1]} ${props.theme.space[3]}`};
  border-radius: ${props => props.theme.radii.full};
  font-size: ${props => props.theme.fontSizes.sm};
  margin-bottom: ${props => props.theme.space[4]};
`;

const MetadataList = styled.div`
  margin-bottom: ${props => props.theme.space[6]};
`;

const MetadataItem = styled(Flex)`
  margin-bottom: ${props => props.theme.space[3]};
  align-items: center;
`;

const MetadataIcon = styled.span`
  color: ${props => props.theme.colors.primary};
  margin-right: ${props => props.theme.space[3]};
  display: flex;
  align-items: center;
`;

const MetadataLabel = styled.span`
  color: ${props => props.theme.colors.mutedForeground};
  margin-right: ${props => props.theme.space[2]};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const MetadataValue = styled.span`
  font-size: ${props => props.theme.fontSizes.sm};
`;

const AudioPlayer = styled.div`
  margin-top: ${props => props.theme.space[4]};
  width: 100%;
  
  audio {
    width: 100%;
  }
`;

const PlayerSection = styled.div`
  margin-top: ${props => props.theme.space[8]};
  padding-top: ${props => props.theme.space[6]};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const SongDetail: React.FC<SongDetailProps> = ({ song }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handlePlay = () => {
    dispatch(setCurrentSong(song));
  };
  
  const handleEdit = () => {
    dispatch(openModal({ type: 'edit', songId: song.id }));
  };
  
  const handleDelete = () => {
    dispatch(openModal({ 
      type: 'delete',
      songId: song.id,
    }));
  };
  
  return (
    <div>
      <DetailContainer>
        <CoverArt>
          <img src={song.imageUrl || '/placeholder.svg'} alt={`${song.album} cover`} />
        </CoverArt>
        
        <SongInfo>
          <div>
            <SongTitle>{song.title}</SongTitle>
            <Artist>{song.artist}</Artist>
            <Genre>{song.genre}</Genre>
            
            <MetadataList>
              <MetadataItem>
                <MetadataIcon>
                  <AlbumIcon size={16} />
                </MetadataIcon>
                <MetadataLabel>Album:</MetadataLabel>
                <MetadataValue>{song.album}</MetadataValue>
              </MetadataItem>
              
              <MetadataItem>
                <MetadataIcon>
                  <Clock size={16} />
                </MetadataIcon>
                <MetadataLabel>Added:</MetadataLabel>
                <MetadataValue>
                  {formatDistanceToNow(new Date(song.createdAt), { addSuffix: true })}
                </MetadataValue>
              </MetadataItem>
            </MetadataList>
          </div>
          
          <Flex mt={4} gap={2} flexWrap="wrap">
            <Button onClick={handlePlay}>
              <Play size={16} style={{ marginRight: '8px' }} />
              Play Song
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Edit size={16} style={{ marginRight: '8px' }} />
              Edit Song
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 size={16} style={{ marginRight: '8px' }} />
              Delete Song
            </Button>
          </Flex>
        </SongInfo>
      </DetailContainer>
      
      <PlayerSection>
        <Title as="h2">Play Song</Title>
        <AudioPlayer>
          <audio controls src={song.audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </AudioPlayer>
      </PlayerSection>
    </div>
  );
};

export default SongDetail;
