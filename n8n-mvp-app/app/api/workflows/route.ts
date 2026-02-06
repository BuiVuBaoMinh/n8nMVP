import { connectDB } from '@/lib/db';
import { Workflow } from '@/models/Workflow';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  
  let workflow;
  
  // Check if a valid ID exists (not null, not undefined, not empty string)
  if (body._id) {
    workflow = await Workflow.findByIdAndUpdate(body._id, body, { new: true });
  } else {
    // CRITICAL FIX: Remove the _id key entirely so Mongoose generates a new ObjectId
    delete body._id; 
    workflow = await Workflow.create(body);
  }
  
  return NextResponse.json(workflow);
}