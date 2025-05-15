
import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
  setCurrentSong,
  togglePlayPause,
  setIsPlaying,
  setCurrentTime,
  setVolume,
  playNext,
  setDuration,
  setRepeat,
} from '../../store/slices/playerSlice';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, List } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: ${props => props.theme.colors.secondary};
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  padding: 0 ${props => props.theme.space[4]};
  z-index: ${props => props.theme.zIndices.docked};

  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    height: 90px;
  }
`;

const SongInfo = styled.div`
  display: flex;
  align-items: center;
  width: 30%;
  min-width: 180px;
`;

const AlbumArt = styled.div`
  width: 50px;
  height: 50px;
  margin-right: ${props => props.theme.space[3]};
  border-radius: ${props => props.theme.radii.sm};
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    width: 60px;
    height: 60px;
  }
`;

const SongDetails = styled.div`
  max-width: calc(100% - 70px);
  overflow: hidden;
`;

const SongTitle = styled.div`
  font-weight: 600;
  font-size: ${props => props.theme.fontSizes.md};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArtistName = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.mutedForeground};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space[2]};
`;

const ControlButton = styled.button<{ size?: 'sm' | 'md' | 'lg' }>`
  background: none;
  border: none;
  color: ${props => props.theme.colors.foreground};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: ${props => props.size === 'lg' ? props.theme.space[2] : props.theme.space[1]};
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background-color: ${props => `${props.theme.colors.primary}11`};
  }
  
  &:disabled {
    color: ${props => props.theme.colors.mutedForeground};
    cursor: not-allowed;
  }
`;

const PlayButton = styled(ControlButton)`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.foreground};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.primaryLight};
    color: ${props => props.theme.colors.foreground};
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${props => props.theme.colors.muted};
  border-radius: ${props => props.theme.radii.full};
  margin-top: ${props => props.theme.space[2]};
  position: relative;
  overflow: hidden;
  cursor: pointer;
`;

const Progress = styled.div<{ width: string }>`
  height: 100%;
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.radii.full};
  width: ${props => props.width};
  transition: width 0.1s linear;
`;

const TimeInfo = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.mutedForeground};
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: ${props => props.theme.space[2]};
`;

const AdditionalControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space[3]};
  width: 30%;
  min-width: 180px;
  justify-content: flex-end;
`;

const VolumeControl = styled.div`
  display: none;
  align-items: center;
  gap: ${props => props.theme.space[2]};
  
  @media (min-width: ${props => props.theme.breakpoints[2]}) {
    display: flex;
  }
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  appearance: none;
  background-color: ${props => props.theme.colors.muted};
  border-radius: ${props => props.theme.radii.full};
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background-color: ${props => props.theme.colors.primary};
    border-radius: 50%;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background-color: ${props => props.theme.colors.primary};
    border-radius: 50%;
    border: none;
    cursor: pointer;
  }
`;

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};

const Player: React.FC = () => {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, volume, queue, repeat } = useSelector((state: RootState) => state.player);
  const [currentTime, setCurrentTimeState] = useState(0);
  const [duration, setDurationState] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Set up audio element
  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;
    
    const onTimeUpdate = () => {
      setCurrentTimeState(audio.currentTime);
      dispatch(setCurrentTime(audio.currentTime));
    };
    
    const onLoadedMetadata = () => {
      setDurationState(audio.duration);
      dispatch(setDuration(audio.duration));
    };
    
    const onEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (queue.length > 0 || repeat === 'all') {
        dispatch(playNext());
      } else {
        dispatch(setIsPlaying(false));
      }
    };
    
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [dispatch, queue, repeat]);
  
  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;
    
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Playback error:', error);
          dispatch(setIsPlaying(false));
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong, dispatch]);
  
  // Handle volume change
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);
  
  const handleTogglePlay = () => {
    dispatch(togglePlayPause());
  };
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * audio.duration;
    
    audio.currentTime = newTime;
    setCurrentTimeState(newTime);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    dispatch(setVolume(newVolume));
  };
  
  const toggleMute = () => {
    if (volume > 0) {
      dispatch(setVolume(0));
    } else {
      dispatch(setVolume(0.7));
    }
  };
  
  const toggleRepeat = () => {
    const nextRepeat = repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off';
    dispatch(setRepeat(nextRepeat));
  };
  
  if (!currentSong) return null;
  
  return (
    <PlayerContainer>
      <audio ref={audioRef} src={currentSong.audioUrl} />
      
      <SongInfo>
        <AlbumArt>
          <img src={currentSong.imageUrl || '/placeholder.svg'} alt={`${currentSong.album} cover`} />
        </AlbumArt>
        <SongDetails>
          <Link to={`/songs/${currentSong.id}`}>
            <SongTitle>{currentSong.title}</SongTitle>
          </Link>
          <ArtistName>{currentSong.artist}</ArtistName>
        </SongDetails>
      </SongInfo>
      
      <Controls>
        <ControlButtons>
          <ControlButton onClick={() => console.log('Previous song')} disabled>
            <SkipBack size={20} />
          </ControlButton>
          <PlayButton size="lg" onClick={handleTogglePlay}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </PlayButton>
          <ControlButton onClick={() => console.log('Next song')} disabled={queue.length === 0}>
            <SkipForward size={20} />
          </ControlButton>
        </ControlButtons>
        
        <ProgressBar onClick={handleSeek}>
          <Progress width={`${(currentTime / duration) * 100}%`} />
        </ProgressBar>
        
        <TimeInfo>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </TimeInfo>
      </Controls>
      
      <AdditionalControls>
        <ControlButton onClick={toggleRepeat}>
          <Repeat 
            size={18} 
            color={repeat !== 'off' ? '#7C3AED' : undefined} 
          />
        </ControlButton>
        <ControlButton>
          <List size={18} />
        </ControlButton>
        <VolumeControl>
          <ControlButton onClick={toggleMute}>
            {volume > 0 ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </ControlButton>
          <VolumeSlider
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
          />
        </VolumeControl>
      </AdditionalControls>
    </PlayerContainer>
  );
};

export default Player;
