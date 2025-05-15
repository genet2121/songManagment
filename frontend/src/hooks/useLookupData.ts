
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchLookupsRequest } from '../store/slices/lookupSlice';

export const useLookupData = () => {
  const dispatch = useDispatch();
  const { artists, genres, albums, loading, error } = useSelector((state: RootState) => state.lookups);
  
  useEffect(() => {
    dispatch(fetchLookupsRequest());
  }, [dispatch]);
  
  return { artists, genres, albums, loading, error };
};
