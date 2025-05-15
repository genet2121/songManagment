
import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { 
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
  deleteSongFailed
} from '../slices/songsSlice';
import { showToast } from '../slices/uiSlice';
import { Song, SongFormData } from '../../types/song.types';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your actual API base URL

// API service for songs
const api = {
  fetchSongs: async (): Promise<Song[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/songs/getAll`);
      if (!response.ok) {
        throw new Error(`Failed to fetch songs: ${response.statusText}`);
      }
      const data = await response.json();
      return data.map((item: any) => ({
        id: item._id.toString(),
        title: item.name,
        artist: item.artist,
        genre: item.genre,
        album: item.album,
        imageUrl: item.imageUrl || '',
        audioUrl: item.audioUrl || '',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching songs:', error);
      throw error;
    }
  },
  
  addSong: async (songData: SongFormData): Promise<Song> => {
    try {
      const formData = new FormData();
      formData.append('title', songData.title);
      formData.append('artist', songData.artist);
      formData.append('genre', songData.genre);
      formData.append('album', songData.album);
      
      if (songData.image) {
        formData.append('imageUrl', songData.image);
      }
      
      if (songData.audio) {
        formData.append('audioUrl', songData.audio);
      }
      
      const response = await fetch(`${API_BASE_URL}/songs/create`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add song: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        id: data._id.toString(),
        title: data.name,
        artist: data.artist,
        genre: data.genre,
        album: data.album,
        imageUrl: data.imageUrl || '',
        audioUrl: data.audioUrl || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    } catch (error) {
      console.error('Error adding song:', error);
      throw error;
    }
  },
  
  updateSong: async (id: string, songData: SongFormData): Promise<Song> => {
    try {
      const formData = new FormData();
      formData.append('name', songData.title);
      formData.append('artist', songData.artist);
      formData.append('genre', songData.genre);
      formData.append('album', songData.album);
      
      if (songData.image) {
        formData.append('image', songData.image);
      }
      
      if (songData.audio) {
        formData.append('audio', songData.audio);
      }
      
      const response = await fetch(`${API_BASE_URL}/songs/${id}`, {
        method: 'PUT',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update song: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        id: data._id.toString(),
        title: data.name,
        artist: data.artist,
        genre: data.genre,
        album: data.album,
        imageUrl: data.imageUrl || '',
        audioUrl: data.audioUrl || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    } catch (error) {
      console.error('Error updating song:', error);
      throw error;
    }
  },
  
  deleteSong: async (id: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/songs/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete song: ${response.statusText}`);
      }
      
      return id;
    } catch (error) {
      console.error('Error deleting song:', error);
      throw error;
    }
  },
  
  // Lookup endpoints for dropdown options
  fetchArtists: async (): Promise<any[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/lookup/artists`);
      if (!response.ok) {
        throw new Error(`Failed to fetch artists: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching artists:', error);
      throw error;
    }
  },
  
  fetchGenres: async (): Promise<any[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/lookup/genres`);
      if (!response.ok) {
        throw new Error(`Failed to fetch genres: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  },
  
  fetchAlbums: async (): Promise<any[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/lookup/albums`);
      if (!response.ok) {
        throw new Error(`Failed to fetch albums: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching albums:', error);
      throw error;
    }
  }
};

// Worker Sagas
function* fetchSongsSaga() {
  try {
    const songs: Song[] = yield call(api.fetchSongs);
    yield put(fetchSongsSuccess(songs));
  } catch (error) {
    yield put(fetchSongsFailed(error instanceof Error ? error.message : 'Failed to fetch songs'));
    yield put(showToast({ message: 'Failed to fetch songs', type: 'error' }));
  }
}

function* addSongSaga(action: PayloadAction<SongFormData>) {
  try {
    const newSong: Song = yield call(api.addSong, action.payload);
    yield put(addSongSuccess(newSong));
    yield put(showToast({ message: 'Song added successfully', type: 'success' }));
  } catch (error) {
    yield put(addSongFailed(error instanceof Error ? error.message : 'Failed to add song'));
    yield put(showToast({ message: 'Failed to add song', type: 'error' }));
  }
}

function* updateSongSaga(action: PayloadAction<{id: string, data: SongFormData}>) {
  try {
    const updatedSong: Song = yield call(api.updateSong, action.payload.id, action.payload.data);
    yield put(updateSongSuccess(updatedSong));
    yield put(showToast({ message: 'Song updated successfully', type: 'success' }));
  } catch (error) {
    yield put(updateSongFailed(error instanceof Error ? error.message : 'Failed to update song'));
    yield put(showToast({ message: 'Failed to update song', type: 'error' }));
  }
}

function* deleteSongSaga(action: PayloadAction<string>) {
  try {
    const deletedId: string = yield call(api.deleteSong, action.payload);
    yield put(deleteSongSuccess(deletedId));
    yield put(showToast({ message: 'Song deleted successfully', type: 'success' }));
  } catch (error) {
    yield put(deleteSongFailed(error instanceof Error ? error.message : 'Failed to delete song'));
    yield put(showToast({ message: 'Failed to delete song', type: 'error' }));
  }
}

// Watcher Saga
export function* watchSongSagas() {
  yield takeLatest(fetchSongsRequest.type, fetchSongsSaga);
  yield takeLatest(addSongRequest.type, addSongSaga);
  yield takeLatest(updateSongRequest.type, updateSongSaga);
  yield takeLatest(deleteSongRequest.type, deleteSongSaga);
}
