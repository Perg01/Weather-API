# Weather-API Project

## Overview

This project is a simple weather Node.js API that fetches weather data from a third-party weather API and serves it to users. The API implements caching with Redis to optimize performance and rate limiting to prevent overuse, making it a scalable and efficient weather data service.

## Features

- Fetches live weather data using a third-party weather API (e.g., Visual Crossing API).
- In-memory caching with Redis to reduce repeated external API calls and improve response times.
- Rate limiting to control the number of requests per user and prevent abuse of the service.
- Environment variables are used to keep sensitive information secure and easily configurable.

## Project Setup

### Pre-requisites

Ensure that you have the following installed:

- Node.js (v12+ recommended)
- Redis (v6.0+ recommended)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Perg01/Weather-API-Project.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add the following environment variables to the `.env` file, replacing the placeholders with your actual values:

   To obtain a Visual Crossing API key, visit [https://www.visualcrossing.com/](https://www.visualcrossing.com/).

   ```bash
   WEATHER_API_KEY=your-weather-api-key
   REDIS_HOST=your-redis-host
   REDIS_PORT=your-redis-port
   ```

### Starting the Server

1. Start the Redis server:

   ```bash
   redis-server
   ```

2. Start the application:
   ```bash
   npm start
   ```
3. The server will start on http://localhost:3000

### API Endpoint

- GET /api/weather
  - Retrieves weather data for a specified city.
  - Query Parameters:
    - city - The city name for which to retrieve weather data.
  Example Request:
  ```bash
  GET http://localhost:3000/api/weather?city=London
  ```

### Example Response

    On a successful request, the server returns a JSON object with the weather data for the specified city.

    ```json
    {
        "city": "London",
        "temperature": "15°C",
        "description": "Partly cloudy",
        "humidity": "73%",
        "wind_speed": "13 km/h"
    }
    ```

### Caching with Redis

Weather data for each city is cached in Redis to reduce external API calls and improve response times. Cached data expires after a predefined period (e.g., 12 hours), so fresh data is fetched after expiration.

### Rate Limiting

Each user is allowed up to 100 requests per hour. If the limit is exceeded, a 429 Too Many Requests response is returned. This helps prevent abuse and ensures API stability.

### Error Handling

The API returns appropriate error messages for cases such as:

- Missing or invalid city names.
- External API errors (e.g., service unavailability).
- Redis connection issues.

### Dependencies

- express: Fast, unopinionated, minimalist web framework for Node.js
- axios: Promise-based HTTP client for making requests to the weather API
- ioredis: Redis client for Node.js to manage in-memory caching
- express-rate-limit: Middleware to apply rate limiting to routes

---

https://roadmap.sh/projects/weather-api-wrapper-service
