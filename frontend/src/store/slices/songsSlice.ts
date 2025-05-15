import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song, SongFormData, SongsState } from '../../types/song.types';

const initialState: SongsState = {
  songs: [],
  filteredSongs: [],
  currentSong: null,
  isPlaying: false,
  loading: false,
  error: null,
  searchTerm: '',
  genreFilter: '',
};

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    // Fetch songs actions
    fetchSongsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSongsSuccess: (state, action: PayloadAction<Song[]>) => {
      state.songs = action.payload;
      state.filteredSongs = action.payload;
      state.loading = false;
    },
    fetchSongsFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Add song actions
    addSongRequest: (state, action: PayloadAction<SongFormData>) => {
      state.loading = true;
      state.error = null;
    },
    addSongSuccess: (state, action: PayloadAction<Song>) => {
      state.songs = [action.payload, ...state.songs];
      state.filteredSongs = state.genreFilter 
        ? state.songs.filter(song => song.genre === state.genreFilter)
        : state.songs;
      state.loading = false;
    },
    addSongFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Update song actions
    updateSongRequest: (state, action: PayloadAction<{id: string, data: SongFormData}>) => {
      state.loading = true;
      state.error = null;
    },
    updateSongSuccess: (state, action: PayloadAction<Song>) => {
      state.songs = state.songs.map(song => 
        song.id === action.payload.id ? action.payload : song
      );
      state.filteredSongs = state.genreFilter 
        ? state.songs.filter(song => song.genre === state.genreFilter)
        : state.songs;
      state.loading = false;
      if (state.currentSong && state.currentSong.id === action.payload.id) {
        state.currentSong = action.payload;
      }
    },
    updateSongFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Delete song actions
    deleteSongRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteSongSuccess: (state, action: PayloadAction<string>) => {
      state.songs = state.songs.filter(song => song.id !== action.payload);
      state.filteredSongs = state.filteredSongs.filter(song => song.id !== action.payload);
      state.loading = false;
      if (state.currentSong && state.currentSong.id === action.payload) {
        state.currentSong = null;
        state.isPlaying = false;
      }
    },
    deleteSongFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Set current song
    setCurrentSong: (state, action: PayloadAction<Song | null>) => {
      state.currentSong = action.payload;
    },
    
    // Toggle play state
    togglePlayState: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    
    // Filter actions
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.filteredSongs = filterSongs(state.songs, action.payload, state.genreFilter);
    },
    setGenreFilter: (state, action: PayloadAction<string>) => {
      state.genreFilter = action.payload;
      state.filteredSongs = filterSongs(state.songs, state.searchTerm, action.payload);
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.genreFilter = '';
      state.filteredSongs = state.songs;
    },
  },
});

// Helper function for filtering songs - updated to work with API IDs
const filterSongs = (songs: Song[], searchTerm: string, genreFilter: string): Song[] => {
  let filtered = [...songs];
  
  if (searchTerm) {
    filtered = filtered.filter(song => 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.album.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (genreFilter) {
    filtered = filtered.filter(song => song.genre === genreFilter);
  }
  
  return filtered;
};

export const {
  fetchSongsRequest,
  fetchSongsSuccess,
  fetchSongsFailed,
  addSongRequest,
  addSongSuccess,
  addSongFailed,
  updateSongRequest,
  updateSongSuccess,
  updateSongFailed,
  deleteSongRequest,
  deleteSongSuccess,
  deleteSongFailed,
  setCurrentSong,
  togglePlayState,
  setSearchTerm,
  setGenreFilter,
  clearFilters,
} = songsSlice.actions;

export default songsSlice.reducer;
