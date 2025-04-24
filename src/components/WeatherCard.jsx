import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY;
const API_URL = 'https://api.weatherapi.com/v1/current.json';

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  color: white;
  cursor: pointer;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const MainInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Temperature = styled.div`
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const WeatherIcon = styled.img`
  width: 80px;
  height: 80px;
`;

const Location = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const CityName = styled.h2`
  font-size: 1.8rem;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const Country = styled.div`
  font-size: 1rem;
  opacity: 0.8;
`;

const Condition = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin-top: 1rem;
`;

const LoadingCard = styled(Card)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const ErrorCard = styled(Card)`
  text-align: center;
  color: #ff6b6b;
`;

const WeatherCard = ({ city, onWeatherChange, onCardClick }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&lang=es`
        );

        if (!response.ok) {
          throw new Error('Error al obtener datos del clima');
        }

        const data = await response.json();
        setWeatherData(data);
        onWeatherChange?.(data.current.condition);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchWeatherData();
    }
  }, [city, onWeatherChange]);

  if (!city) return null;

  if (loading) {
    return (
      <LoadingCard>
        <div>Cargando...</div>
      </LoadingCard>
    );
  }

  if (error) {
    return (
      <ErrorCard>
        <div>{error}</div>
      </ErrorCard>
    );
  }

  if (!weatherData) return null;

  const {
    location: { name, country },
    current: { temp_c, condition }
  } = weatherData;

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => onCardClick?.(weatherData)}
    >
      <Location>
        <CityName>{name}</CityName>
        <Country>{country}</Country>
      </Location>

      <MainInfo>
        <Temperature>{Math.round(temp_c)}°C</Temperature>
        <WeatherIcon 
          src={condition.icon} 
          alt={condition.text}
        />
      </MainInfo>

      <Condition>
        {condition.text}
      </Condition>
    </Card>
  );
};

export default WeatherCard;
