
import React from 'react';
import { Container } from '../components/styled/Container';
import { Title, Subtitle } from '../components/styled/Typography';
import { Card } from '../components/styled/Card';
import SongForm from '../components/Songs/SongForm';
import styled from '@emotion/styled';

const FormWrapper = styled(Card)`
  max-width: 700px;
  margin: 0 auto;
  padding: ${props => props.theme.space[6]};
`;

const AddSongPage: React.FC = () => {
  return (
    <Container py={6}>
      <Title>Add New Song</Title>
      <Subtitle>Add a new song to your music collection</Subtitle>
      
      <FormWrapper>
        <SongForm />
      </FormWrapper>
    </Container>
  );
};

export default AddSongPage;
