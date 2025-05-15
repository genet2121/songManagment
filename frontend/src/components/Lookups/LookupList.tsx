
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { deleteLookupRequest } from '../../store/slices/lookupSlice';
import { Lookup } from '../../store/slices/lookupSlice';
import styled from '@emotion/styled';
import { Card } from '../styled/Card';
import { Button } from '../styled/Button';
import { Flex } from '../styled/Flex';
import { Edit, Trash2, Search, RefreshCw, Filter } from 'lucide-react';
import { Input } from '../styled/Input';
import { Select } from '../styled/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const ListContainer = styled(Card)`
  overflow: hidden;
`;

const SearchBar = styled(Flex)`
  padding: ${props => props.theme.space[4]};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.muted};
`;

const NoResults = styled.div`
  padding: ${props => props.theme.space[6]};
  text-align: center;
  color: ${props => props.theme.colors.mutedForeground};
`;

const CategoryBadge = styled.span<{ category: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => 
    props.category === 'artist' ? '#e0f2fe' : 
    props.category === 'genre' ? '#f0fdf4' : 
    props.category === 'album' ? '#fef3c7' : '#f4f4f5'};
  color: ${props => 
    props.category === 'artist' ? '#0284c7' : 
    props.category === 'genre' ? '#16a34a' : 
    props.category === 'album' ? '#d97706' : '#71717a'};
`;

type LookupListProps = {
  onEdit: (lookup: Lookup) => void;
};

const LookupList: React.FC<LookupListProps> = ({ onEdit }) => {
  const dispatch = useDispatch();
  const { allLookups, loading } = useSelector((state: RootState) => state.lookups);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Filter lookups based on search term and category filter
  const filteredLookups = allLookups.filter(lookup => {
    const matchesSearch = lookup.value.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || lookup.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  const handleDelete = (id: string) => {
    console.log('Deleting lookup with ID:', id);
    if (window.confirm('Are you sure you want to delete this lookup?')) {
      dispatch(deleteLookupRequest(id));
    }
  };
  
  return (
    <ListContainer>
      <SearchBar justifyContent="space-between" alignItems="center">
        <Flex flex={1} mr={3}>
          <Input
            type="text"
            placeholder="Search lookup values..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startIcon={<Search size={16} />}
          />
        </Flex>
        
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ width: '150px' }}
        >
          <option value="">All Categories</option>
          <option value="artist">Artists</option>
          <option value="genre">Genres</option>
          <option value="album">Albums</option>
        </Select>
      </SearchBar>
      
      {loading ? (
        <Flex justifyContent="center" py={6}>
          <RefreshCw size={24} className="animate-spin" />
        </Flex>
      ) : filteredLookups.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: '150px', textAlign: 'right' }}>Category</TableHead>
              <TableHead style={{ width: '150px', textAlign: 'right' }}>Value</TableHead>
              <TableHead style={{ width: '150px', textAlign: 'right' }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLookups.map((lookup) => (
              <TableRow key={lookup._id} style={{ width: '150px', textAlign: 'right' }}>
                <TableCell>
                  <CategoryBadge category={lookup.category}>
                    {lookup.category.charAt(0).toUpperCase() + lookup.category.slice(1)}
                  </CategoryBadge>
                </TableCell>
                <TableCell>{lookup.value}</TableCell>
                <TableCell>
                  <Flex justifyContent="flex-end">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(lookup)} title="Edit">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(lookup._id)} title="Delete">
                      <Trash2 size={16} />
                    </Button>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <NoResults>
          <Filter size={24} />
          <p>No lookups found</p>
        </NoResults>
      )}
    </ListContainer>
  );
};

export default LookupList;
