
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLookupRequest, updateLookupRequest } from '../../store/slices/lookupSlice';
import { RootState } from '../../store';
import styled from '@emotion/styled';
import { Button } from '../styled/Button';
import { FormGroup, FormLabel, Input, Select, FormHelperText } from '../styled/Input';
import { Flex } from '../styled/Flex';
import { Loader2 } from 'lucide-react';

type LookupFormProps = {
  editMode?: boolean;
  lookupId?: string;
  initialCategory?: string;
  initialValue?: string;
  onClose?: () => void;
};

const Form = styled.form`
  width: 100%;
`;

const categoryOptions = [
  { value: 'artist', label: 'Artist' },
  { value: 'genre', label: 'Genre' },
  { value: 'album', label: 'Album' }
];

const LookupForm: React.FC<LookupFormProps> = ({
  editMode = false,
  lookupId,
  initialCategory = '',
  initialValue = '',
  onClose
}) => {
  const [category, setCategory] = useState(initialCategory);
  const [value, setValue] = useState(initialValue);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.lookups);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!category) {
      newErrors.category = 'Category is required';
    }
    
    if (!value.trim()) {
      newErrors.value = 'Value is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  console.log('lookupId:', lookupId);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (editMode && lookupId) {
      dispatch(updateLookupRequest({ _id: lookupId, category, value }));
    } else {
      dispatch(addLookupRequest({ category, value }));
    }
    
    if (onClose) onClose();
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <FormLabel htmlFor="category">Category</FormLabel>
        <Select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          error={!!errors.category}
        >
          <option value="">Select a category</option>
          {categoryOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {errors.category && <FormHelperText error>{errors.category}</FormHelperText>}
      </FormGroup>
      
      <FormGroup>
        <FormLabel htmlFor="value">Value</FormLabel>
        <Input
          type="text"
          id="value"
          placeholder="Enter lookup value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={!!errors.value}
        />
        {errors.value && <FormHelperText error>{errors.value}</FormHelperText>}
      </FormGroup>
      
      <Flex justifyContent="flex-end" mt={4}>
        {onClose && (
          <Button type="button" variant="ghost" onClick={onClose} mr={2}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              {editMode ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            editMode ? 'Update Lookup' : 'Add Lookup'
          )}
        </Button>
      </Flex>
    </Form>
  );
};

export default LookupForm;
