import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchSongsRequest } from '../store/slices/songsSlice';
import { Container } from '../components/styled/Container';
import { Grid } from '../components/styled/Grid';
import { Title, Subtitle } from '../components/styled/Typography';
import { Card, CardTitle, CardDescription } from '../components/styled/Card';
import SongCard from '../components/Songs/SongCard';
import { Music, Headphones, Album, FileAudio } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Define our own tooltip props type instead of importing it
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload?: any;
  }>;
  label?: string;
}

const DashboardContainer = styled(Container)`
  padding-top: ${props => props.theme.space[6]};
  padding-bottom: ${props => props.theme.space[6]};
`;

const StatsGrid = styled(Grid)`
  gap: ${props => props.theme.space[4]};
  margin-bottom: ${props => props.theme.space[6]};
`;

const StatCard = styled(Card)`
  display: flex;
  align-items: center;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.radii.md};
  background-color: ${props => `${props.theme.colors.primary}22`};
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.theme.space[4]};
`;

const StatContent = styled.div``;

const StatValue = styled.div`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: 700;
  margin-bottom: ${props => props.theme.space[1]};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.mutedForeground};
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: ${props => props.theme.space[6]};
`;

const ChartCard = styled(Card)`
  padding: ${props => props.theme.space[5]};
  height: 100%;
`;

const SectionHeading = styled.div`
  margin-bottom: ${props => props.theme.space[4]};
`;

const COLORS = ['#7C3AED', '#9D6FEB', '#C4B5FD', '#DDD6FE', '#EDE9FE', '#F5F3FF'];

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { songs } = useSelector((state: RootState) => state.songs);
  
  useEffect(() => {
    dispatch(fetchSongsRequest());
  }, [dispatch]);
  
  // Calculate statistics
  const totalSongs = songs.length;
  const uniqueArtists = new Set(songs.map(song => song.artist)).size;
  const uniqueAlbums = new Set(songs.map(song => song.album)).size;
  
  // Group songs by genre
  const genreData = Object.entries(
    songs.reduce((acc: Record<string, number>, song) => {
      acc[song.genre] = (acc[song.genre] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
  
  // Sort by date for recent songs
  const recentSongs = [...songs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: '#1F1F23', 
          padding: '10px',
          border: '1px solid #2E2E34',
          borderRadius: '4px'
        }}>
          <p style={{ color: '#F9FAFB' }}>{`${payload[0].name}: ${payload[0].value} songs`}</p>
        </div>
      );
    }
  
    return null;
  };
  
  return (
    <DashboardContainer>
      <SectionHeading>
        <Title>Dashboard</Title>
        <Subtitle>Overview of your music collection</Subtitle>
      </SectionHeading>
      
      <StatsGrid gridTemplateColumns={{ _: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}>
        <StatCard>
          <StatIcon>
            <FileAudio size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{totalSongs}</StatValue>
            <StatLabel>Total Songs</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <Headphones size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{uniqueArtists}</StatValue>
            <StatLabel>Artists</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <Album size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{uniqueAlbums}</StatValue>
            <StatLabel>Albums</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <Music size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{Object.keys(genreData).length}</StatValue>
            <StatLabel>Genres</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>
      
      <Grid 
        gridTemplateColumns={{ _: '1fr', md: '1fr 1fr' }} 
        gap={6}
        mb={6}
      >
        <ChartCard>
          <CardTitle>Songs by Genre</CardTitle>
          <CardDescription>Distribution of songs across different genres</CardDescription>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={genreData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2E2E34" />
                <XAxis dataKey="name" tick={{ fill: '#A1A1AA' }} />
                <YAxis tick={{ fill: '#A1A1AA' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Songs" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>
        
        <ChartCard>
          <CardTitle>Genre Distribution</CardTitle>
          <CardDescription>Percentage of songs in each genre</CardDescription>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>
      </Grid>
      
      <div>
        <SectionHeading>
          <Title as="h2">Recently Added Songs</Title>
          <Subtitle>Your latest additions to the music collection</Subtitle>
        </SectionHeading>
        
        {recentSongs.length > 0 ? (
          <Grid 
            gridTemplateColumns={{ _: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={4}
          >
            {recentSongs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </Grid>
        ) : (
          <Card>
            <CardTitle>No songs added yet</CardTitle>
            <CardDescription>Add some songs to see them here</CardDescription>
          </Card>
        )}
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;
