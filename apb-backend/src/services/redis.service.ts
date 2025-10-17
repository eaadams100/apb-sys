import { createClient } from 'redis';

export class RedisService {
    private client: any;

    constructor() {
        this.client = createClient({
            url: 'redis://localhost:6379'
        });

        this.client.on('error', (err: any) => {
            console.error('Redis Client Error', err);
        });

        this.client.on('connect', () => {
            console.log('Redis Client Connected');
        });
    }

    async connect(): Promise<void> {
        try {
            await this.client.connect();
            console.log('Successfully connected to Redis');
        } catch (error) {
            console.error('Failed to connect to Redis:', error);
            throw error;
        }
    }

    async set(key: string, value: string, expireInSeconds?: number): Promise<void> {
        if (expireInSeconds) {
            await this.client.setEx(key, expireInSeconds, value);
        } else {
            await this.client.set(key, value);
        }
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }

    async disconnect(): Promise<void> {
        await this.client.disconnect();
    }

    // For handling objects (JSON)
    async setObject(key: string, value: any, expireInSeconds?: number): Promise<void> {
        const stringValue = JSON.stringify(value);
        await this.set(key, stringValue, expireInSeconds);
    }

    async getObject(key: string): Promise<any> {
        const stringValue = await this.get(key);
        return stringValue ? JSON.parse(stringValue) : null;
    }
}