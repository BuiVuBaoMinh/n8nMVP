import { Workflow } from '../models/Workflow.ts';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import mongoose from 'mongoose';

// 1. Setup Connections
const redisConnection = new IORedis('redis://localhost:6379', { maxRetriesPerRequest: null });
const MONGO_URI = 'mongodb://localhost:27017/n8n-remake';

async function startWorker() {
    await mongoose.connect(MONGO_URI);
    console.log("Worker connected to DB");

    const worker = new Worker('n8n-queue', async (job) => {
        console.log(`\n[Job ${job.id}] Starting Execution...`);
        
        // 2. Load Workflow
        const workflow = await Workflow.findOne();
        if (!workflow) {
            console.log("No workflow found to run!");
            return;
        }

        console.log(`Graph: ${workflow.name} (${workflow.nodes.length} nodes)`);

        // 3. Execute Nodes (Traversal Logic)
        // Sort nodes by logic or just iterate for MVP
        for (const node of workflow.nodes) {
            console.log(`--> Executing Node: [${node.data.label}]`);
            
            // SIMULATION: If it's a "Wait" node, we could actually wait here
            if (node.data.label.toLowerCase().includes('wait')) {
                console.log("    ...Sleeping for 1 second...");
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        console.log(`[Job ${job.id}] Finished!`);

    }, { connection: redisConnection });

    console.log("Worker is running and listening for jobs...");
}

startWorker();