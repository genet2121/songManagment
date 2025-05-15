
import React from 'react';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Container } from '../components/styled/Container';
import { Title, Subtitle } from '../components/styled/Typography';
import { Button } from '../components/styled/Button';
import { setCurrentSong } from '../store/slices/playerSlice';
import { Play, Music } from 'lucide-react';

const PlayerPageContainer = styled(Container)`
  padding-top: ${props => props.theme.space[6]};
  padding-bottom: ${props => props.theme.space[6]};
`;

const PlayerHero = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.space[8]};
`;

const NowPlaying = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => props.theme.space[8]};
`;

const AlbumArt = styled.div`
  width: 300px;
  height: 300px;
  border-radius: ${props => props.theme.radii.lg};
  overflow: hidden;
  margin-bottom: ${props => props.theme.space[4]};
  box-shadow: ${props => props.theme.shadows['2xl']};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    width: 400px;
    height: 400px;
  }
`;

const SongTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: 700;
  margin-bottom: ${props => props.theme.space[2]};
`;

const ArtistName = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.mutedForeground};
  margin-bottom: ${props => props.theme.space[4]};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.space[8]};
  text-align: center;
`;

const IconWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${props => `${props.theme.colors.muted}`};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.space[6]};
`;

const PlayerPage: React.FC = () => {
  const { currentSong, isPlaying } = useSelector((state: RootState) => state.player);
  const { songs } = useSelector((state: RootState) => state.songs);
  const dispatch = useDispatch();
  
  const playSong = (song: any) => {
    dispatch(setCurrentSong(song));
  };
  
  return (
    <PlayerPageContainer>
      <PlayerHero>
        <Title>Music Player</Title>
        <Subtitle>Enjoy your favorite songs with enhanced audio quality</Subtitle>
      </PlayerHero>
      
      {currentSong ? (
        <NowPlaying>
          <AlbumArt>
            <img src={currentSong.imageUrl || '/placeholder.svg'} alt={`${currentSong.album} cover`} />
          </AlbumArt>
          <SongTitle>{currentSong.title}</SongTitle>
          <ArtistName>{currentSong.artist}</ArtistName>
        </NowPlaying>
      ) : (
        <EmptyState>
          <IconWrapper>
            <Music size={48} />
          </IconWrapper>
          <Title as="h2">No song playing</Title>
          <Subtitle>Select a song from your collection to start playing</Subtitle>
          
          {songs.length > 0 && (
            <Button 
              onClick={() => playSong(songs[0])} 
              style={{ marginTop: '24px' }}
            >
              <Play size={16} style={{ marginRight: '8px' }} />
              Play a Song
            </Button>
          )}
        </EmptyState>
      )}
    </PlayerPageContainer>
  );
};

export default PlayerPage;
