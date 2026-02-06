import { connectDB } from '@/lib/db';
import { Workflow } from '@/models/Workflow';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  
  let workflow;
  
  if (body._id) {
    workflow = await Workflow.findByIdAndUpdate(body._id, body, { new: true });
  } else {
    // Remove the _id key entirely so Mongoose generates a new ObjectId
    delete body._id; 
    workflow = await Workflow.create(body);
  }
  
  return NextResponse.json(workflow);
}