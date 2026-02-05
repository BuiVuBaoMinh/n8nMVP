import { NextResponse } from 'next/server';
import { workflowQueue } from '@/lib/queue';

export async function POST() {
  // Add a job to the Redis queue
  await workflowQueue.add('execute-graph', { 
    triggeredAt: Date.now() 
  });
  
  return NextResponse.json({ status: 'queued' });
}