# React Clima Vite

Esta es una aplicación web creada con React y Vite para consultar el clima de ciudades. Permite buscar ciudades, ver su clima actual y agregarlas a favoritos, los cuales se guardan en localStorage para aparecer siempre en la pantalla de inicio.

## Características
- Buscar ciudades y consultar su clima.
- Agregar ciudades a favoritos.
- Los favoritos se guardan en localStorage (sin autenticación).
- Visualización de favoritos en la pantalla principal.

## Configuración
1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Renombra el archivo `.env.example` a `.env` y coloca tu API key de OpenWeatherMap.

## Scripts
- `npm run dev`: Ejecuta la app en modo desarrollo.
- `npm run build`: Construye la app para producción.

## Notas
- Necesitas una API key gratuita de [OpenWeatherMap](https://openweathermap.org/api).
- No se requiere autenticación, los favoritos se guardan localmente.
