export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
}

export interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

export interface WeatherReport {
  location: string;
  temperatureUnit: 'C' | 'F';
  windUnit: 'km/h' | 'mph';
  current: CurrentWeather;
  forecast: ForecastDay[];
}

interface Location {
  name: string;
  country?: string;
  region?: string;
  latitude: number;
  longitude: number;
}

type JsonRecord = Record<string, unknown>;

const weatherDescriptions: Record<number, { condition: string; icon: string }> = {
  0: { condition: 'Clear sky', icon: '☀️' },
  1: { condition: 'Mostly clear', icon: '🌤️' },
  2: { condition: 'Partly cloudy', icon: '⛅' },
  3: { condition: 'Overcast', icon: '☁️' },
  45: { condition: 'Foggy', icon: '🌫️' },
  48: { condition: 'Rime fog', icon: '🌫️' },
  51: { condition: 'Light drizzle', icon: '🌦️' },
  53: { condition: 'Drizzle', icon: '🌦️' },
  55: { condition: 'Heavy drizzle', icon: '🌧️' },
  56: { condition: 'Light freezing drizzle', icon: '🌧️' },
  57: { condition: 'Freezing drizzle', icon: '🌧️' },
  61: { condition: 'Light rain', icon: '🌦️' },
  63: { condition: 'Rain', icon: '🌧️' },
  65: { condition: 'Heavy rain', icon: '🌧️' },
  66: { condition: 'Light freezing rain', icon: '🌧️' },
  67: { condition: 'Freezing rain', icon: '🌧️' },
  71: { condition: 'Light snow', icon: '🌨️' },
  73: { condition: 'Snow', icon: '🌨️' },
  75: { condition: 'Heavy snow', icon: '❄️' },
  77: { condition: 'Snow grains', icon: '🌨️' },
  80: { condition: 'Light rain showers', icon: '🌦️' },
  81: { condition: 'Rain showers', icon: '🌧️' },
  82: { condition: 'Heavy rain showers', icon: '⛈️' },
  85: { condition: 'Light snow showers', icon: '🌨️' },
  86: { condition: 'Heavy snow showers', icon: '❄️' },
  95: { condition: 'Thunderstorm', icon: '⛈️' },
  96: { condition: 'Thunderstorm with hail', icon: '⛈️' },
  99: { condition: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function finiteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

async function fetchJson(url: URL, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Weather service request failed (${response.status}). Please try again.`);
  }
  return response.json();
}

async function findLocation(city: string, signal?: AbortSignal): Promise<Location> {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.search = new URLSearchParams({ name: city, count: '1', language: 'en', format: 'json' }).toString();
  const payload = await fetchJson(url, signal);

  if (!isRecord(payload)) {
    throw new Error('The location service returned an unexpected response.');
  }

  if (payload.results === undefined) {
    throw new Error(`No location found for "${city}". Check the spelling and try again.`);
  }
  if (!Array.isArray(payload.results)) {
    throw new Error('The location service returned an unexpected response.');
  }

  const match = payload.results.find(isRecord);
  if (!match) {
    throw new Error(`No location found for "${city}". Check the spelling and try again.`);
  }

  const { name, country, admin1, latitude, longitude } = match;
  if (
    typeof name !== 'string' ||
    !finiteNumber(latitude) ||
    !finiteNumber(longitude) ||
    (country !== undefined && typeof country !== 'string') ||
    (admin1 !== undefined && typeof admin1 !== 'string')
  ) {
    throw new Error('The location service returned incomplete location details.');
  }

  return { name, country, region: admin1, latitude, longitude };
}

function getWeatherDescription(code: number): { condition: string; icon: string } {
  return weatherDescriptions[code] ?? { condition: 'Unknown conditions', icon: '🌡️' };
}

function requireNumber(record: JsonRecord, key: string): number {
  const value = record[key];
  if (!finiteNumber(value)) {
    throw new Error('The weather service returned incomplete forecast data.');
  }
  return value;
}

export async function getWeather(
  city: string,
  unit: TemperatureUnit,
  signal?: AbortSignal,
): Promise<WeatherReport> {
  if (!city.trim()) {
    throw new Error('Enter a city to see its weather.');
  }

  const location = await findLocation(city.trim(), signal);
  const temperatureUnit = unit === 'fahrenheit' ? 'fahrenheit' : 'celsius';
  const windSpeedUnit = unit === 'fahrenheit' ? 'mph' : 'kmh';
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.search = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    temperature_unit: temperatureUnit,
    wind_speed_unit: windSpeedUnit,
    forecast_days: '5',
    timezone: 'auto',
  }).toString();

  const payload = await fetchJson(url, signal);
  if (!isRecord(payload) || !isRecord(payload.current) || !isRecord(payload.daily)) {
    throw new Error('The weather service returned an unexpected forecast.');
  }

  const currentCode = requireNumber(payload.current, 'weather_code');
  const currentDescription = getWeatherDescription(currentCode);
  const place = [location.name, location.region, location.country].filter(Boolean).join(', ');
  const times = payload.daily.time;
  const codes = payload.daily.weather_code;
  const highs = payload.daily.temperature_2m_max;
  const lows = payload.daily.temperature_2m_min;

  if (
    !Array.isArray(times) ||
    !Array.isArray(codes) ||
    !Array.isArray(highs) ||
    !Array.isArray(lows)
  ) {
    throw new Error('The weather service returned an unexpected daily forecast.');
  }

  const forecast = times.map((date, index) => {
    if (
      typeof date !== 'string' ||
      !finiteNumber(codes[index]) ||
      !finiteNumber(highs[index]) ||
      !finiteNumber(lows[index])
    ) {
      throw new Error('The weather service returned incomplete daily forecast data.');
    }

    return {
      date,
      high: Math.round(highs[index]),
      low: Math.round(lows[index]),
      ...getWeatherDescription(codes[index]),
    };
  });

  return {
    location: place,
    temperatureUnit: unit === 'fahrenheit' ? 'F' : 'C',
    windUnit: unit === 'fahrenheit' ? 'mph' : 'km/h',
    current: {
      temperature: Math.round(requireNumber(payload.current, 'temperature_2m')),
      apparentTemperature: Math.round(requireNumber(payload.current, 'apparent_temperature')),
      humidity: requireNumber(payload.current, 'relative_humidity_2m'),
      windSpeed: Math.round(requireNumber(payload.current, 'wind_speed_10m')),
      ...currentDescription,
    },
    forecast,
  };
}
