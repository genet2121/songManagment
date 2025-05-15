
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Lookup {
  _id: string;
  category: string;
  value: string;
}

interface LookupState {
  artists: Lookup[];
  genres: Lookup[];
  albums: Lookup[];
  allLookups: Lookup[];
  loading: boolean;
  error: string | null;
}

const initialState: LookupState = {
  artists: [],
  genres: [],
  albums: [],
  allLookups: [],
  loading: false,
  error: null,
};

const lookupSlice = createSlice({
  name: 'lookups',
  initialState,
  reducers: {
    // Fetch lookups actions
    fetchLookupsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLookupsSuccess: (state, action: PayloadAction<Lookup[]>) => {
      state.allLookups = action.payload;
      
      // Filter lookups by category
      state.artists = action.payload.filter(lookup => lookup.category === 'artist');
      state.genres = action.payload.filter(lookup => lookup.category === 'genre');
      state.albums = action.payload.filter(lookup => lookup.category === 'album');
      
      state.loading = false;
    },
    fetchLookupsFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Add lookup actions
    addLookupRequest: (state, action: PayloadAction<{ category: string; value: string }>) => {
      state.loading = true;
      state.error = null;
    },
    addLookupSuccess: (state, action: PayloadAction<Lookup>) => {
      state.allLookups.push(action.payload);
      
      // Update the appropriate category array
      if (action.payload.category === 'artist') {
        state.artists.push(action.payload);
      } else if (action.payload.category === 'genre') {
        state.genres.push(action.payload);
      } else if (action.payload.category === 'album') {
        state.albums.push(action.payload);
      }
      
      state.loading = false;
    },
    addLookupFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Update lookup actions
    updateLookupRequest: (state, action: PayloadAction<{ _id: string; category: string; value: string }>) => {
      state.loading = true;
      state.error = null;
    },
    updateLookupSuccess: (state, action: PayloadAction<Lookup>) => {
      // Update in all lookups
      state.allLookups = state.allLookups.map(lookup =>
        lookup._id === action.payload._id ? action.payload : lookup
      );
      
      // Update in the appropriate category array
      if (action.payload.category === 'artist') {
        state.artists = state.artists.map(artist =>
          artist._id === action.payload._id ? action.payload : artist
        );
      } else if (action.payload.category === 'genre') {
        state.genres = state.genres.map(genre =>
          genre._id === action.payload._id ? action.payload : genre
        );
      } else if (action.payload.category === 'album') {
        state.albums = state.albums.map(album =>
          album._id === action.payload._id ? action.payload : album
        );
      }
      
      state.loading = false;
    },
    updateLookupFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Delete lookup actions
    deleteLookupRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteLookupSuccess: (state, action: PayloadAction<string>) => {
      const lookupToDelete = state.allLookups.find(l => l._id === action.payload);
      
      if (lookupToDelete) {
        // Remove from all lookups
        state.allLookups = state.allLookups.filter(lookup => lookup._id !== action.payload);
        
        // Remove from the appropriate category array
        if (lookupToDelete.category === 'artist') {
          state.artists = state.artists.filter(artist => artist._id !== action.payload);
        } else if (lookupToDelete.category === 'genre') {
          state.genres = state.genres.filter(genre => genre._id !== action.payload);
        } else if (lookupToDelete.category === 'album') {
          state.albums = state.albums.filter(album => album._id !== action.payload);
        }
      }
      
      state.loading = false;
    },
    deleteLookupFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchLookupsRequest,
  fetchLookupsSuccess,
  fetchLookupsFailed,
  addLookupRequest,
  addLookupSuccess,
  addLookupFailed,
  updateLookupRequest,
  updateLookupSuccess,
  updateLookupFailed,
  deleteLookupRequest,
  deleteLookupSuccess,
  deleteLookupFailed,
} = lookupSlice.actions;

export default lookupSlice.reducer;
