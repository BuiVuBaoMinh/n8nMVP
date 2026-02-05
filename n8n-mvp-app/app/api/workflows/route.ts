import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Workflow } from '@/models/Workflow';

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  
  // For MVP, we just update the first workflow we find, or create one if empty
  const workflow = await Workflow.findOneAndUpdate(
    {}, 
    body, 
    { upsert: true, new: true }
  );
  
  return NextResponse.json(workflow);
}