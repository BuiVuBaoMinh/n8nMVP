import mongoose, { Schema } from 'mongoose';

const WorkflowSchema = new Schema({
  name: { type: String, required: true },
  nodes: { type: Array, default: [] },
  edges: { type: Array, default: [] },
}, { timestamps: true });

// Prevent overwrite errors during hot reloading
export const Workflow = mongoose.models.Workflow || mongoose.model('Workflow', WorkflowSchema);