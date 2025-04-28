import React from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
`;

const ModalContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  position: relative;
  width: 70%;
  max-height: 90vh;
  overflow-y: hidden;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);

  @media (max-width: 900px) {
    width: 90%;
    padding: 1.2rem;
    max-height: 90vh;
    overflow-y: auto;
  }
  @media (max-width: 600px) {
    width: 95%;
    padding: 0.5rem;
    font-size: 0.95rem;
  }
`;

const CloseButton = styled(motion.button)`
  position: static;
  margin-left: 0;
  margin-right: 0;
  top: auto;
  right: auto;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  transition: all 0.3s ease;
  width: 38px;
  height: 38px;
  box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.17);
  z-index: 2;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const DetailSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
`;

const DetailTitle = styled.h3`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
`;

const WeatherDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const CityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  position: relative;
  min-height: 38px;
`;

const CityName = styled.h2`
  color: white;
  font-size: 1.8rem;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: max-content;
  pointer-events: none;
`;

const FavoriteButton = styled(motion.button)`
  position: static;
  margin-left: 0;
  margin-right: 0;
  top: auto;
  left: auto;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  transition: all 0.3s ease;
  width: 38px;
  height: 38px;
  box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.17);
  z-index: 2;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const LocalTime = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: white;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 10px;
`;

const ForecastSection = styled.div`
  margin-top: 1rem;
  overflow-x: auto;
`;

const ForecastContainer = styled.div`
  display: flex;
  gap: 10px;
  padding-bottom: 10px;
  justify-content: space-between;
`;

const ForecastDay = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.8rem;
  flex: 1;
  text-align: center;
  
  @media (max-width: 900px) {
    min-width: 120px;
    flex: none;
  }
  
  @media (max-width: 600px) {
    min-width: 100px;
    padding: 0.5rem;
  }
`;

const DayName = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
`;

const ForecastIcon = styled.img`
  width: 50px;
  height: 50px;
  margin: 0 auto;
`;

const ForecastTemp = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 0.5rem;
  
  .max {
    color: #ff9e7d;
    font-weight: bold;
  }
  
  .min {
    color: #7dc8ff;
  }
`;

const WeatherModal = ({ 
  isOpen, 
  onClose, 
  weatherData, 
  isFavorite,
  onToggleFavorite 
}) => {
  if (!weatherData) return null;

  const {
    location: { name, country, localtime },
    current: {
      temp_c,
      feelslike_c,
      humidity,
      wind_kph,
      wind_dir,
      pressure_mb,
      precip_mm,
      uv,
      vis_km,
      cloud
    },
    forecast: { forecastday }
  } = weatherData;
  
  // Formatear la hora local
  const formatLocalTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };
  
  // Obtener el nombre del día de la semana
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <CityHeader>
              <FavoriteButton
                onClick={() => onToggleFavorite(name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{isFavorite ? '★' : '☆'}</span>
              </FavoriteButton>
              <CityName>{name}, {country}</CityName>
              <CloseButton 
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </CloseButton>
            </CityHeader>
            
            <LocalTime>
              {formatLocalTime(localtime)}
            </LocalTime>

            <DetailSection>
              <DetailTitle>Sensación y Ambiente</DetailTitle>
              <WeatherDetails>
                <div>
                  <span>🌡️ Sensación:</span>
                  <span>{Math.round(feelslike_c)}°C</span>
                </div>
                <div>
                  <span>💧 Humedad:</span>
                  <span>{humidity}%</span>
                </div>
                <div>
                  <span>☁️ Nubosidad:</span>
                  <span>{cloud}%</span>
                </div>
                <div>
                  <span>👁️ Visibilidad:</span>
                  <span>{vis_km} km</span>
                </div>
              </WeatherDetails>
            </DetailSection>

            <DetailSection>
              <DetailTitle>Viento y Presión</DetailTitle>
              <WeatherDetails>
                <div>
                  <span>💨 Viento:</span>
                  <span>{wind_kph} km/h</span>
                </div>
                <div>
                  <span>🧭 Dirección:</span>
                  <span>{wind_dir}</span>
                </div>
                <div>
                  <span>📊 Presión:</span>
                  <span>{pressure_mb} hPa</span>
                </div>
                <div>
                  <span>🌧️ Precipitación:</span>
                  <span>{precip_mm} mm</span>
                </div>
              </WeatherDetails>
            </DetailSection>

            <DetailSection>
              <DetailTitle>Índice UV</DetailTitle>
              <WeatherDetails>
                <div>
                  <span>☀️ UV:</span>
                  <span>{uv} ({getUVDescription(uv)})</span>
                </div>
              </WeatherDetails>
            </DetailSection>
            
            <DetailSection>
              <DetailTitle>Previsión Semanal</DetailTitle>
              <ForecastSection>
                <ForecastContainer>
                  {forecastday.map((day) => (
                    <ForecastDay key={day.date}>
                      <DayName>{getDayName(day.date)}</DayName>
                      <ForecastIcon 
                        src={day.day.condition.icon} 
                        alt={day.day.condition.text}
                      />
                      <ForecastTemp>
                        <span className="max">{Math.round(day.day.maxtemp_c)}°</span>
                        <span className="min">{Math.round(day.day.mintemp_c)}°</span>
                      </ForecastTemp>
                    </ForecastDay>
                  ))}
                </ForecastContainer>
              </ForecastSection>
            </DetailSection>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

const getUVDescription = (uv) => {
  if (uv <= 2) return 'Bajo';
  if (uv <= 5) return 'Moderado';
  if (uv <= 7) return 'Alto';
  if (uv <= 10) return 'Muy Alto';
  return 'Extremo';
};

export default WeatherModal;
