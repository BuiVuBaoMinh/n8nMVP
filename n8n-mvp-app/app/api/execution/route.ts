import { NextResponse } from 'next/server';
import { workflowQueue } from '@/lib/queue';

export async function POST(req: Request) {
  const body = await req.json();
  const { workflowId } = body;

  if (!workflowId) {
    return NextResponse.json({ error: 'workflowId is required' }, { status: 400 });
  }

  // Add job to Redis
  await workflowQueue.add('execute-graph', { 
    workflowId,
    triggeredAt: Date.now() 
  });
  
  return NextResponse.json({ status: 'queued', workflowId });
}