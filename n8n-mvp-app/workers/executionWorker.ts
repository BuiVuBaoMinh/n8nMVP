
import { ExecutionEngine } from '../lib/executeEngine';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis('redis://localhost:6379', { maxRetriesPerRequest: null });

const worker = new Worker('n8n-queue', async (job) => {
  console.log(`[Worker] Processing Job ${job.id}`);
  
  const { workflowId } = job.data;
  
  if (!workflowId) {
    console.error(`[Worker] Job ${job.id} missing workflowId!`);
    return;
  }

  const engine = new ExecutionEngine();
  try {
    const result = await engine.runWorkflow(workflowId);
    console.log(`[Worker] Workflow ${workflowId} Completed!`, result);
  } catch (error) {
    console.error(`[Worker] Workflow Failed:`, error);
  }

}, { connection });

console.log("Worker is running and listening for jobs...");