import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import AutocompleteSearch from './components/AutocompleteSearch';
import WeatherModal from './components/WeatherModal';
import FavoriteCities from './components/FavoriteCities';
import DynamicBackground from './components/DynamicBackground';

const FAVORITES_KEY = 'favorite_cities';

const getFavorites = () => {
  const saved = localStorage.getItem(FAVORITES_KEY);
  return saved ? JSON.parse(saved) : [];
};

const AppContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const Title = styled(motion.h1)`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  padding: 0 1rem;

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0;
    gap: 1rem;
    padding: 0 0.5rem;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    margin: 0;
    gap: 0.5rem;
    padding: 0 0.25rem;
  }
`;

function App() {
  const [selectedCity, setSelectedCity] = useState('');
  const [favorites, setFavorites] = useState(getFavorites());
  const [currentWeather, setCurrentWeather] = useState('clear');
  const [modalData, setModalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const fetchWeatherData = async (city) => {
    const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY;
    const API_URL = 'https://api.weatherapi.com/v1/current.json';

    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&lang=es`
      );

      if (!response.ok) {
        throw new Error('Error al obtener datos del clima');
      }

      const data = await response.json();
      setModalData(data);
      setCurrentWeather(data.current.condition.text.toLowerCase());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = async (city) => {
    setSelectedCity(city);
    await fetchWeatherData(city);
  };

  const handleAddFavorite = (city) => {
    if (!favorites.includes(city)) {
      setFavorites([...favorites, city]);
    }
  };

  const handleRemoveFavorite = (city) => {
    setFavorites(favorites.filter(fav => fav !== city));
  };

  const handleToggleFavorite = (city) => {
    if (favorites.includes(city)) {
      handleRemoveFavorite(city);
    } else {
      handleAddFavorite(city);
    }
  };

  return (
    <>
      <DynamicBackground weatherCondition={currentWeather} />
      <AppContainer>
        <Title
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Clima App ☀️
        </Title>
        
        <ContentContainer>
          <AutocompleteSearch onCitySelect={handleCitySelect} />

          <FavoriteCities
            favorites={favorites}
            onCitySelect={handleCitySelect}
            onRemoveFavorite={handleRemoveFavorite}
          />
        </ContentContainer>

        <WeatherModal
          isOpen={!!modalData && !isLoading}
          onClose={() => setModalData(null)}
          weatherData={modalData}
          isFavorite={modalData ? favorites.includes(modalData.location.name) : false}
          onToggleFavorite={handleToggleFavorite}
        />
      </AppContainer>
    </>
  );
}

export default App;
