import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Search, MapPin, Heart, Cloud, CloudRain, Sun, Wind } from "lucide-react";

const API_KEY = "1635890035cbba097fd5c26c8ea672a1";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
}

interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
    dt_txt: string;
  }[];
}

const WeatherApp = () => {
  const [city, setCity] = useState<string>('');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('weatherFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentResponse = await fetch(
        `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!currentResponse.ok) {
        throw new Error('City not found');
      }
      
      const currentData = await currentResponse.json();
      setCurrentWeather(currentData);
      
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!forecastResponse.ok) {
        throw new Error('Forecast data not available');
      }
      
      const forecastData = await forecastResponse.json();
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  const toggleFavorite = (cityName: string) => {
    if (favorites.includes(cityName)) {
      setFavorites(favorites.filter(fav => fav !== cityName));
    } else {
      setFavorites([...favorites, cityName]);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    switch (iconCode.substring(0, 2)) {
      case '01': return <Sun className="h-8 w-8 text-yellow-500" />;
      case '02':
      case '03':
      case '04': return <Cloud className="h-8 w-8 text-gray-500" />;
      case '09':
      case '10': return <CloudRain className="h-8 w-8 text-blue-500" />;
      default: return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDailyForecast = () => {
    if (!forecast) return [];
    
    const dailyData: { [key: string]: any } = {};
    
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US');
      
      if (!dailyData[date]) {
        dailyData[date] = item;
      }
    });
    
    return Object.values(dailyData).slice(0, 5);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Weather Forecast App</CardTitle>
          <CardDescription>Search for a city to get the current weather and 5-day forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Searching...' : <Search className="h-4 w-4 mr-2" />}
              Search
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {favorites.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Favorites:</h3>
              <div className="flex flex-wrap gap-2">
                {favorites.map(fav => (
                  <Badge 
                    key={fav} 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => {
                      setCity(fav);
                      fetchWeather(fav);
                    }}
                  >
                    {fav}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {currentWeather && (
        <Tabs defaultValue="current" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Weather</TabsTrigger>
            <TabsTrigger value="forecast">5-Day Forecast</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">
                      {currentWeather.name}, {currentWeather.sys.country}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      Current Weather
                    </CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleFavorite(currentWeather.name)}
                    className={favorites.includes(currentWeather.name) ? "text-red-500" : ""}
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center mb-4 md:mb-0">
                    {getWeatherIcon(currentWeather.weather[0].icon)}
                    <div className="ml-4">
                      <div className="text-4xl font-bold">
                        {Math.round(currentWeather.main.temp)}°C
                      </div>
                      <div className="text-muted-foreground capitalize">
                        {currentWeather.weather[0].description}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">Feels like:</span>
                      <span>{Math.round(currentWeather.main.feels_like)}°C</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">Humidity:</span>
                      <span>{currentWeather.main.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">Wind:</span>
                      <span>{currentWeather.wind.speed} m/s</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">Pressure:</span>
                      <span>{currentWeather.main.pressure} hPa</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="forecast">
            <Card>
              <CardHeader>
                <CardTitle>5-Day Forecast for {currentWeather.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {getDailyForecast().map((day, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="p-3 pb-0">
                        <CardTitle className="text-sm font-medium">
                          {formatDate(day.dt)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 text-center">
                        {getWeatherIcon(day.weather[0].icon)}
                        <div className="mt-2 font-bold">{Math.round(day.main.temp)}°C</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {day.weather[0].description}
                        </div>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div className="text-muted-foreground">Humidity</div>
                          <div>{day.main.humidity}%</div>
                          <div className="text-muted-foreground">Wind</div>
                          <div>{day.wind.speed} m/s</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default WeatherApp;
