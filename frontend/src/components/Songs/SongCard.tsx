
import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { setCurrentSong } from '../../store/slices/playerSlice';
import { openModal } from '../../store/slices/uiSlice';
import { Song } from '../../types/song.types';
import { Play, Edit, Trash2 } from 'lucide-react';
import { Card } from '../styled/Card';

type SongCardProps = {
  song: Song;
  compact?: boolean;
};

const StyledCard = styled(Card) <{ compact?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: ${props => props.compact ? 'row' : 'column'};
  align-items: ${props => props.compact ? 'center' : 'flex-start'};
  height: ${props => props.compact ? '80px' : 'auto'};
  margin-bottom: ${props => props.theme.space[4]};
  padding: ${props => props.compact ? props.theme.space[3] : props.theme.space[4]};
  overflow: hidden;
`;

const AlbumCover = styled.div<{ compact?: boolean }>`
  position: relative;
  width: ${props => props.compact ? '60px' : '100%'};
  height: ${props => props.compact ? '60px' : '0'};
  padding-bottom: ${props => props.compact ? '0' : '100%'};
  border-radius: ${props => props.theme.radii.md};
  overflow: hidden;
  margin-bottom: ${props => props.compact ? '0' : props.theme.space[3]};
  margin-right: ${props => props.compact ? props.theme.space[3] : '0'};
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    ${props => !props.compact && `
      position: absolute;
      top: 0;
      left: 0;
    `}
  }
`;

const PlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  border: none;
  color: ${props => props.theme.colors.foreground};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
  }
`;

const CoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const SongInfo = styled.div<{ compact?: boolean }>`
  flex: 1;
  ${props => props.compact ? '' : 'width: 100%;'}
`;

const SongTitle = styled.h3<{ compact?: boolean }>`
  font-size: ${props => props.compact ? props.theme.fontSizes.md : props.theme.fontSizes.xl};
  font-weight: 600;
  margin: 0;
  margin-bottom: ${props => props.compact ? '0' : props.theme.space[1]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SongMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.space[1]};
`;

const SongArtist = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.mutedForeground};
  margin: 0;
`;

const SongGenre = styled.span`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.primary};
  background-color: ${props => `${props.theme.colors.primary}22`};
  padding: ${props => `${props.theme.space[1]} ${props.theme.space[2]}`};
  border-radius: ${props => props.theme.radii.full};
  display: inline-block;
`;

const CardActions = styled.div<{ compact?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.compact ? 'flex-end' : 'space-between'};
  width: ${props => props.compact ? 'auto' : '100%'};
  margin-top: ${props => props.compact ? '0' : props.theme.space[3]};
  padding-top: ${props => props.compact ? '0' : props.theme.space[3]};
  border-top: ${props => props.compact ? 'none' : `1px solid ${props.theme.colors.border}`};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.mutedForeground};
  padding: ${props => props.theme.space[2]};
  border-radius: ${props => props.theme.radii.md};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.theme.colors.foreground};
    background-color: ${props => props.theme.colors.muted};
  }
  
  & + & {
    margin-left: ${props => props.theme.space[1]};
  }
`;

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  
  &:hover {
    text-decoration: none;
  }
`;

const CardContainer = styled.div`
  position: relative;
  
  &:hover {
    ${PlayButton}, ${CoverOverlay} {
      opacity: 1;
    }
  }
`;

const SongCard: React.FC<SongCardProps> = ({ song, compact = false }) => {
  const dispatch = useDispatch();
  
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setCurrentSong(song));
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(openModal({ type: 'edit', songId: song.id }));
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(openModal({ type: 'delete', songId: song.id }));
  };
  
  return (
    <CardContainer>
      <StyledLink to={`/songs/${song.id}`}>
        <StyledCard compact={compact}>
          <AlbumCover compact={compact}>
            <img src={song.imageUrl || '/placeholder.svg'} alt={`${song.album} cover`} />
            <CoverOverlay />
            <PlayButton onClick={handlePlay}>
              <Play size={18} />
            </PlayButton>
          </AlbumCover>
          
          <SongInfo compact={compact}>
            <SongTitle compact={compact}>{song.title}</SongTitle>
            <SongMeta>
              <SongArtist>{song.artist}</SongArtist>
              {!compact && <SongGenre>{song.genre}</SongGenre>}
            </SongMeta>
          </SongInfo>
          
          <CardActions compact={compact}>
            <ActionButton onClick={handleEdit} title="Edit Song">
              <Edit size={16} />
            </ActionButton>
            <ActionButton onClick={handleDelete} title="Delete Song">
              <Trash2 size={16} />
            </ActionButton>
          </CardActions>
        </StyledCard>
      </StyledLink>
    </CardContainer>
  );
};

export default SongCard;
