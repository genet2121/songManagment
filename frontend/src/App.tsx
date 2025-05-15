
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from '@emotion/react';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import Layout from './components/Layout/Layout';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import SongsList from './pages/SongsList';
import AddSong from './pages/AddSong';
import SongDetail from './pages/SongDetail';
import PlayerPage from './pages/PlayerPage';
import LookupsPage from './pages/LookupsPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/songs" element={<SongsList />} />
              <Route path="/songs/add" element={<AddSong />} />
              <Route path="/songs/:id" element={<SongDetail />} />
              <Route path="/player" element={<PlayerPage />} />
              <Route path="/lookups" element={<LookupsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
