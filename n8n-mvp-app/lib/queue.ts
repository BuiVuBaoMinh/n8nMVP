import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis('redis://localhost:6379', {
    maxRetriesPerRequest: null 
});

export const workflowQueue = new Queue('n8n-queue', { connection });