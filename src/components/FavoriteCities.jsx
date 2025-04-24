import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY;
const API_URL = 'https://api.weatherapi.com/v1/current.json';

const FavoritesContainer = styled.div`
  margin: 2rem 0;
  width: 100%;
  max-width: 1200px;
`;

const Title = styled.h2`
  color: white;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
`;

const FavoritesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;

  @media (max-width: 768px) {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }

  @media (max-width: 480px) {
    padding-left: 0.1rem;
    padding-right: 0.1rem;
  }
`;

const FavoriteCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  width: 100%;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);

  &:hover {
    transform: translateY(-5px);
  }
`;

const CityName = styled.h3`
  color: white;
  font-size: 1.3rem;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const WeatherInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
`;

const Temperature = styled.div`
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const WeatherIcon = styled.img`
  width: 40px;
  height: 40px;
`;

const RemoveButton = styled(motion.button)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 59, 59, 0.2);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0;
  transition: all 0.3s ease;

  ${FavoriteCard}:hover > & {
    opacity: 1;
  }

  &:hover {
    background: rgba(255, 59, 59, 0.4);
    transform: scale(1.1);
  }
`;

const FavoriteCities = ({ favorites = [], onCitySelect, onRemoveFavorite }) => {
  const [citiesData, setCitiesData] = useState({});

  useEffect(() => {
    const fetchCitiesData = async () => {
      const newData = {};
      for (const city of favorites) {
        try {
          const res = await fetch(`${API_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&lang=es`);
          if (!res.ok) continue;
          const data = await res.json();
          newData[city] = data;
        } catch (error) {
          console.error(`Error fetching data for ${city}:`, error);
        }
      }
      setCitiesData(newData);
    };

    if (favorites.length > 0) {
      fetchCitiesData();
    } else {
      setCitiesData({});
    }
  }, [favorites]);

  if (!favorites || favorites.length === 0) {
    return (
      <FavoritesContainer>
        <Title>Ciudades Favoritas</Title>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}
        >
          No tienes ciudades favoritas aún
        </motion.div>
      </FavoritesContainer>
    );
  }

  return (
    <FavoritesContainer>
      <Title>Ciudades Favoritas</Title>
      <FavoritesList>
        {favorites.map((city, index) => {
          const cityData = citiesData[city];

          return (
            <FavoriteCard
              key={city}
              onClick={() => onCitySelect(city)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RemoveButton
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(city);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </RemoveButton>
              
              <CityName>{city}</CityName>
              
              <WeatherInfo>
                <Temperature>
                  {cityData ? `${Math.round(cityData.current.temp_c)}°C` : '--°C'}
                </Temperature>
                {cityData && (
                  <WeatherIcon
                    src={cityData.current.condition.icon}
                    alt={cityData.current.condition.text}
                  />
                )}
              </WeatherInfo>
            </FavoriteCard>
          );
        })}
      </FavoritesList>
    </FavoritesContainer>
  );
};

export default FavoriteCities;
