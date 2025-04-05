# Weather Forecast App

A responsive weather forecast application built with React, TypeScript, and Vite.

![Weather Forecast App Screenshot](https://github.com/buchi1988/250405devin04/assets/screenshot.png)

## Features

- **City Search**: Search for weather information by city name
- **Current Weather**: View detailed current weather conditions
- **5-Day Forecast**: See weather predictions for the next 5 days
- **Favorites**: Save your favorite cities for quick access
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **React**: Frontend library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components built with Radix UI and Tailwind
- **OpenWeatherMap API**: Weather data provider

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/buchi1988/250405devin04.git
   cd 250405devin04
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173/250405devin04/
   ```

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/         # UI components
│   ├── ui/             # shadcn/ui components
│   └── WeatherApp.tsx  # Main weather application component
├── hooks/              # Custom React hooks
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── ...
```

## API Usage

The application uses the OpenWeatherMap API to fetch weather data. The following endpoints are used:

- Current weather: `api.openweathermap.org/data/2.5/weather`
- 5-day forecast: `api.openweathermap.org/data/2.5/forecast`

## Features in Detail

### Current Weather

Displays:
- City name and country
- Current temperature
- Weather description
- Feels like temperature
- Humidity
- Wind speed
- Atmospheric pressure

### 5-Day Forecast

Shows a daily forecast for the next 5 days with:
- Date
- Weather icon
- Temperature
- Weather description
- Humidity
- Wind speed

### Favorites

- Add cities to favorites by clicking the heart icon
- Favorites are stored in localStorage
- Click on a favorite city to quickly load its weather data
