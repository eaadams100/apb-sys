import express from 'express';
import { RedisService } from './services/redis.service';

// Create Express app
const app = express();

// Initialize Redis
const redisService = new RedisService();

async function initializeApp() {
    try {
        // Connect to Redis first
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
        // Then start your server
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to initialize app:', error);
        process.exit(1);
    }
}

initializeApp();