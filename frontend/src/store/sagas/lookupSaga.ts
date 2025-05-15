
import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
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
  Lookup
} from '../slices/lookupSlice';
import { showToast } from '../slices/uiSlice';

// API base URL
// const API_BASE_URL = 'http://localhost:5000/api'; 
 const API_BASE_URL =  'https://songmanagment-1.onrender.com/api'

// API service for lookups
const api = {
  fetchLookups: async (): Promise<Lookup[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/lookups/getAll`);
      if (!response.ok) {
        throw new Error(`Failed to fetch lookups: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching lookups:', error);
      throw error;
    }
  },
  
  addLookup: async (data: { category: string; value: string }): Promise<Lookup> => {
    try {
      const response = await fetch(`${API_BASE_URL}/lookups/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add lookup: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding lookup:', error);
      throw error;
    }
  },
  
  updateLookup: async (data: { _id: string; category: string; value: string }): Promise<Lookup> => {
    try {
      const response = await fetch(`${API_BASE_URL}/lookups/update/${data._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: data.category, value: data.value }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update lookup: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating lookup:', error);
      throw error;
    }
  },
  
  deleteLookup: async (id: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/lookups/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete lookup: ${response.statusText}`);
      }
      
      return id;
    } catch (error) {
      console.error('Error deleting lookup:', error);
      throw error;
    }
  },
};

// Worker Sagas
function* fetchLookupsSaga() {
  try {
    const lookups: Lookup[] = yield call(api.fetchLookups);
    yield put(fetchLookupsSuccess(lookups));
  } catch (error) {
    yield put(fetchLookupsFailed(error instanceof Error ? error.message : 'Failed to fetch lookups'));
    yield put(showToast({ message: 'Failed to fetch lookups', type: 'error' }));
  }
}

function* addLookupSaga(action: PayloadAction<{ category: string; value: string }>) {
  try {
    const newLookup: Lookup = yield call(api.addLookup, action.payload);
    yield put(addLookupSuccess(newLookup));
    yield put(showToast({ message: 'Lookup added successfully', type: 'success' }));
  } catch (error) {
    yield put(addLookupFailed(error instanceof Error ? error.message : 'Failed to add lookup'));
    yield put(showToast({ message: 'Failed to add lookup', type: 'error' }));
  }
}

function* updateLookupSaga(action: PayloadAction<{ _id: string; category: string; value: string }>) {
  try {
    const updatedLookup: Lookup = yield call(api.updateLookup, action.payload);
    yield put(updateLookupSuccess(updatedLookup));
    yield put(showToast({ message: 'Lookup updated successfully', type: 'success' }));
  } catch (error) {
    yield put(updateLookupFailed(error instanceof Error ? error.message : 'Failed to update lookup'));
    yield put(showToast({ message: 'Failed to update lookup', type: 'error' }));
  }
}

function* deleteLookupSaga(action: PayloadAction<string>) {
  try {
    const deletedId: string = yield call(api.deleteLookup, action.payload);
    yield put(deleteLookupSuccess(deletedId));
    yield put(showToast({ message: 'Lookup deleted successfully', type: 'success' }));
  } catch (error) {
    yield put(deleteLookupFailed(error instanceof Error ? error.message : 'Failed to delete lookup'));
    yield put(showToast({ message: 'Failed to delete lookup', type: 'error' }));
  }
}

// Watcher Saga
export function* watchLookupSagas() {
  yield takeLatest(fetchLookupsRequest.type, fetchLookupsSaga);
  yield takeLatest(addLookupRequest.type, addLookupSaga);
  yield takeLatest(updateLookupRequest.type, updateLookupSaga);
  yield takeLatest(deleteLookupRequest.type, deleteLookupSaga);
}
