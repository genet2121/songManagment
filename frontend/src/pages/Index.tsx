
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSongsRequest } from '../store/slices/songsSlice';
import SongsListPage from './SongsList';

const Index = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchSongsRequest());
  }, [dispatch]);

  return <SongsListPage />;
};

export default Index;
