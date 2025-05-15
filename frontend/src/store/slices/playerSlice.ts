
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song } from '../../types/song.types';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Song[];
  repeat: 'off' | 'one' | 'all';
  shuffle: boolean;
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  queue: [],
  repeat: 'off',
  shuffle: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<Song | null>) => {
      state.currentSong = action.payload;
      state.currentTime = 0;
      if (action.payload) {
        state.isPlaying = true;
      }
    },
    togglePlayPause: (state) => {
      if (state.currentSong) {
        state.isPlaying = !state.isPlaying;
      }
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    addToQueue: (state, action: PayloadAction<Song>) => {
      state.queue.push(action.payload);
    },
    removeFromQueue: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter(song => song.id !== action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
    playNext: (state) => {
      if (state.queue.length > 0) {
        const nextSong = state.queue[0];
        state.currentSong = nextSong;
        state.queue = state.queue.slice(1);
        state.currentTime = 0;
      } else {
        state.currentSong = null;
        state.isPlaying = false;
      }
    },
    setRepeat: (state, action: PayloadAction<'off' | 'one' | 'all'>) => {
      state.repeat = action.payload;
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
  },
});

export const {
  setCurrentSong,
  togglePlayPause,
  setIsPlaying,
  setVolume,
  setCurrentTime,
  setDuration,
  addToQueue,
  removeFromQueue,
  clearQueue,
  playNext,
  setRepeat,
  toggleShuffle,
} = playerSlice.actions;

export default playerSlice.reducer;
