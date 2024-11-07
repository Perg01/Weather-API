import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import Redis from 'ioredis';
import rateLimit from 'express-rate-limit';

dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

const app = express();
const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const getWeatherData = async (city) => {
    const apiURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${WEATHER_API_KEY}`;

    try {
        const response = await axios.get(apiURL);
        return response.data;
    } catch (error) {
        console.error('Error fetching /api/weather data:', error.message);
        return { error: error.message };
    }
};

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // 100 requests per hour per IP
    message: {
        error: 'Too many requests, please try again later.',
        message: 'You have exceeded the 100 requests per hour limit.'
    },
    headers: true,
});

// Applies rate limiter to all routes under /api
app.use('/api', limiter);

app.get('/', async (req, res) => {
    res.send('Hello World');
});

app.get('/api/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        // Check if data is already cached
        const cacheKey = `weather:${city.toLowerCase()}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        // Fetch data from API if not in cache
        const weatherData = await getWeatherData(city);

        // Cache the API response with a 12 hour expiration
        // Data is saved in Redis when fresh data is retrieved
        await redis.set(cacheKey, JSON.stringify(weatherData), 'EX', 43200);
        console.log(`Data cached for future requests: ${city}`);

        return res.json(weatherData);
    }
    catch (error) {
        console.error('Error fetching /api/weather data:', error.message);
        return res.status(500).json({ error: message.error });
    }

});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
