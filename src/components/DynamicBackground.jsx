import React from 'react';
import styled from '@emotion/styled';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  transition: background-image 1s ease;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
  }
`;

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 17) return 'day';
  if (hour >= 17 && hour < 19) return 'dusk';
  return 'night';
};

const backgroundImages = {
  clear: {
    dawn: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    day: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2',
    dusk: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28',
    night: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e'
  },
  clouds: {
    dawn: 'https://images.unsplash.com/photo-1514454923228-7ef0f0c9bd24',
    day: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda',
    dusk: 'https://images.unsplash.com/photo-1515883843710-cb6d71f4e557',
    night: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda'
  },
  rain: {
    dawn: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721',
    day: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0',
    dusk: 'https://images.unsplash.com/photo-1503429134808-fdf0cd4e1bfa',
    night: 'https://images.unsplash.com/photo-1501999635878-71cb5379c2d8'
  },
  snow: {
    dawn: 'https://images.unsplash.com/photo-1516431883744-a3c979c3119a',
    day: 'https://images.unsplash.com/photo-1516431883744-a3c979c3119a',
    dusk: 'https://images.unsplash.com/photo-1516431883744-a3c979c3119a',
    night: 'https://images.unsplash.com/photo-1516431883744-a3c979c3119a'
  },
  default: {
    dawn: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    day: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2',
    dusk: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28',
    night: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e'
  }
};

const DynamicBackground = ({ weatherCondition = 'clear' }) => {
  const timeOfDay = getTimeOfDay();
  const condition = weatherCondition.toLowerCase();
  
  let backgroundSet = backgroundImages.default;
  if (condition.includes('clear')) backgroundSet = backgroundImages.clear;
  else if (condition.includes('cloud')) backgroundSet = backgroundImages.clouds;
  else if (condition.includes('rain')) backgroundSet = backgroundImages.rain;
  else if (condition.includes('snow')) backgroundSet = backgroundImages.snow;

  return (
    <BackgroundContainer
      style={{
        backgroundImage: `url(${backgroundSet[timeOfDay]})`
      }}
    />
  );
};

export default DynamicBackground;
