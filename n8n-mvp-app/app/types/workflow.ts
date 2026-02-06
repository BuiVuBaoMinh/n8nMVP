import { Node, Edge } from '@xyflow/react';

export interface WorkflowData {
  name: string;
  nodes: Node[];
  edges: Edge[];
}

export interface ExecutionContext {
  jobId: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  results: Record<string, any>; // nodeId -> output data
  errors: Record<string, string>; // nodeId -> error message
  logs: string[];
}