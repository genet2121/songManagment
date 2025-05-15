
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  modalOpen: boolean;
  modalType: 'add' | 'edit' | 'delete' | null;
  selectedSongId: string | null;
  toast: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  };
}

const initialState: UiState = {
  sidebarOpen: true,
  modalOpen: false,
  modalType: null,
  selectedSongId: null,
  toast: {
    show: false,
    message: '',
    type: 'info',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openModal: (state, action: PayloadAction<{type: 'add' | 'edit' | 'delete', songId?: string}>) => {
      state.modalOpen = true;
      state.modalType = action.payload.type;
      state.selectedSongId = action.payload.songId || null;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.modalType = null;
      state.selectedSongId = null;
    },
    showToast: (state, action: PayloadAction<{message: string, type: 'success' | 'error' | 'info'}>) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
    },
  },
});

export const {
  toggleSidebar,
  openModal,
  closeModal,
  showToast,
  hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;
