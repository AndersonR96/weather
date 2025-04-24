import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY;
const API_URL = 'https://api.weatherapi.com/v1/current.json';

const SearchContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled(motion.input)`
  flex: 1;
`;

const SearchButton = styled(motion.button)`
  background: var(--text-color);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #d13651;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.variant === 'primary' ? 'var(--text-color)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  margin: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#d13651' : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #ff6b6b;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const ResultContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  margin-top: 2rem;
  color: white;
  text-align: left;

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  .weather-info {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
`;

const CitySearch = ({ onCitySelect, onAddFavorite, favorites }) => {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setError('');
    setSearchResult(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&lang=es`);
      if (!res.ok) throw new Error('Ciudad no encontrada');
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewWeather = () => {
    if (searchResult && searchResult.location) {
      onCitySelect(searchResult.location.name);
    }
  };

  const handleAdd = () => {
    if (searchResult && searchResult.location && !favorites.includes(searchResult.location.name)) {
      onAddFavorite(searchResult.location.name);
    }
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar ciudad..."
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />
        <SearchButton
          type="submit"
          disabled={!query.trim() || loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </SearchButton>
      </SearchForm>

      {error && (
        <ErrorMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {error}
        </ErrorMessage>
      )}

      {searchResult && searchResult.location && (
        <ResultContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>{searchResult.location.name}, {searchResult.location.country}</h3>
          <div className="weather-info">
            <div>Clima: {searchResult.current.condition.text}</div>
            <div>Temperatura: {searchResult.current.temp_c}°C</div>
          </div>
          <div className="actions">
            <ActionButton
              onClick={handleViewWeather}
              variant="primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver clima
            </ActionButton>
            <ActionButton
              onClick={handleAdd}
              disabled={favorites.includes(searchResult.location.name)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {favorites.includes(searchResult.location.name) ? 'Ya en favoritos' : 'Agregar a favoritos'}
            </ActionButton>
          </div>
        </ResultContainer>
      )}
    </SearchContainer>
  );
};

export default CitySearch;
