
export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  album: string;
  imageUrl: string;
  audioUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SongFormData {
  title: string;
  artist: string;
  genre: string;
  album: string;
  image: File | null;
  audio: File | null;
  imageUrl?: string;
  audioUrl?: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface SongsState {
  songs: Song[];
  filteredSongs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  genreFilter: string;
}
