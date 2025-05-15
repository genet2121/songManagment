import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setSearchTerm, setGenreFilter, clearFilters } from '../../store/slices/songsSlice';
import { Grid } from '../styled/Grid';
import { Input } from '../styled/Input';
import { Button } from '../styled/Button';
import { Flex } from '../styled/Flex';
import SongCard from './SongCard';
import { Search, X, Filter, Loader2 } from 'lucide-react';
import { useLookupData } from '../../hooks/useLookupData';

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: ${props => props.theme.space[4]};
  width: 100%;
`;

const SearchInput = styled(Input)`
  padding-left: ${props => props.theme.space[10]};
  padding-right: ${props => props.theme.space[10]};
`;

const SearchIcon = styled.span`
  position: absolute;
  top: 50%;
  left: ${props => props.theme.space[3]};
  transform: translateY(-50%);
  color: ${props => props.theme.colors.mutedForeground};
`;

const ClearButton = styled.button`
  position: absolute;
  top: 50%;
  right: ${props => props.theme.space[3]};
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.mutedForeground};
  cursor: pointer;
  padding: ${props => props.theme.space[1]};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.theme.colors.foreground};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.space[2]};
  margin-bottom: ${props => props.theme.space[4]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.space[8]} 0;
`;

const EmptyStateTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: ${props => props.theme.space[2]};
`;

const EmptyStateText = styled.p`
  color: ${props => props.theme.colors.mutedForeground};
  margin-bottom: ${props => props.theme.space[4]};
`;

const GenreFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.space[2]};
  margin-bottom: ${props => props.theme.space[4]};
`;

const GenreTag = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.foreground : props.theme.colors.mutedForeground};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.radii.full};
  padding: ${props => `${props.theme.space[1]} ${props.theme.space[3]}`};
  font-size: ${props => props.theme.fontSizes.xs};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.muted};
    color: ${props => props.active ? props.theme.colors.foreground : props.theme.colors.foreground};
  }
`;

const FilterButton = styled(Button) <{ active: boolean }>`
  ${props => props.active && `
    background-color: ${props.theme.colors.muted};
    color: ${props.theme.colors.foreground};
  `}
`;

// Get unique genres from songs
const getUniqueGenres = (songs: any[]): string[] => {
  const genres = songs.map(song => song.genre).filter(Boolean);
  return [...new Set(genres)].sort();
};

const SongList: React.FC = () => {
  const { songs, filteredSongs, searchTerm, genreFilter } = useSelector((state: RootState) => state.songs);
  const dispatch = useDispatch();
  
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Get genres from the API
  const { genres, loading: genresLoading } = useLookupData();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };
  
  const handleClearSearch = () => {
    dispatch(setSearchTerm(''));
  };
  
  const handleGenreFilter = (genreId: string) => {
    if (genreFilter === genreId) {
      dispatch(clearFilters());
    } else {
      dispatch(setGenreFilter(genreId));
    }
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };
  
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  return (
    <div>
      <SearchContainer>
        <SearchIcon>
          <Search size={18} />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Search by title, artist, or album..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <ClearButton onClick={handleClearSearch}>
            <X size={18} />
          </ClearButton>
        )}
      </SearchContainer>
      
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <FilterButton 
          variant="ghost" 
          size="sm"
          onClick={toggleFilters}
          active={showFilters}
        >
          <Filter size={16} style={{ marginRight: '8px' }} />
          Filters
        </FilterButton>
        
        {(searchTerm || genreFilter) && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear all filters
          </Button>
        )}
      </Flex>
      
      {showFilters && (
        <GenreFilter>
          {genresLoading ? (
            <Flex alignItems="center" gap={2}>
              <Loader2 size={16} className="animate-spin" />
              <span>Loading genres...</span>
            </Flex>
          ) : genres.length > 0 ? (
            genres.map(genre => (
              <GenreTag 
                key={genre.id} 
                onClick={() => handleGenreFilter(genre.id)}
                active={genreFilter === genre.id}
              >
                {genre.value}
              </GenreTag>
            ))
          ) : (
            <span>No genres available</span>
          )}
        </GenreFilter>
      )}
      
      {filteredSongs.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No songs found</EmptyStateTitle>
          <EmptyStateText>
            {searchTerm || genreFilter 
              ? 'Try changing your search or filter criteria'
              : 'Add some songs to get started'}
          </EmptyStateText>
          <Button onClick={handleClearFilters}>Clear Filters</Button>
        </EmptyState>
      ) : (
        <Grid
          gridTemplateColumns={{ 
            _: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)' 
          }}
          gap={4}
        >
          {filteredSongs.map(song => (
            <SongCard key={song.id} song={song} />
          ))}
        </Grid>
      )}
    </div>
  );
};

export default SongList;
