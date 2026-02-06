import { Workflow } from "../models/Workflow";
import { connectDB } from "./db";

export class ExecutionEngine {
    private context: any = {};
    private executionLog: any[] = [];

    async runWorkflow(workflowId: string) {
        await connectDB();
        const workflow = await Workflow.findById(workflowId);
        if (!workflow) throw new Error('Workflow not found');

        const { nodes, edges } = workflow;

        // 1. Find Start node
        const startNode = nodes.find((n: any) => n.type === 'input' || n.type === 'trigger');
        if (!startNode) throw new Error('Start node not found!');

        console.log(`[Engine] Starting workflow ${workflowId} from node ${startNode.id}`);

        // 2. Initialize Queue (BFS)
        const queue = [startNode];
        const visited = new Set();

        while (queue.length > 0) {
            const currentNode = queue.shift();
            if (!currentNode) break;

            const nodeType = currentNode.data?.jobType || currentNode.type;

            try {
                const output = await this.executeNode(currentNode);
                this.context[currentNode.id] = output; // Store output in context
                
                console.log(`[Engine] Node ${currentNode.data.label} executed. Output:`, output);
            } catch (err: any) {
                console.error(`[Engine] Node ${currentNode.id} failed:`, err.message);
                break;
            }

            // Find next node
            const connectedEdges = edges.filter((edge: any) => edge.source === currentNode.id);

            for (const edge of connectedEdges) {
                // Handle Branching (Condition Nodes)
                // If the current node was a condition, we check if the edge matches the result
                if (nodeType === 'condition') {
                const result = this.context[currentNode.id]?.result; // true or false
                const requiredHandle = result ? 'true' : 'false';
                
                // Only follow the edge that matches the condition result (sourceHandle)
                if (edge.sourceHandle !== requiredHandle) continue; 
                }

                const nextNode = nodes.find((n: any) => n.id === edge.target);
                if (nextNode) queue.push(nextNode);
            }
        }
        
        return { status: 'completed', context: this.context };
    }

    // Node logic
    private async executeNode(node: any) {
        const nodeType = node.data?.jobType || node.type;

        switch (nodeType) {
            case 'input':
            case 'trigger':
                return { triggeredAt: new Date().toISOString() };
            
            case 'agent':
                // Mocking LLM call for now
                return { text: `AI repsonse to inputs...`, model: 'gpt-4'};

            case 'condition':
                // Random 50/50 split for testing. 
                // In real app, evaluate logic like: context[prevNode].value > 10
                const isTrue = Math.random() > 0.5;
                console.log(`[Engine] Condition evaluated to: ${isTrue}`);
                return { result: isTrue };
            
            case 'http':
                // Mock HTTP Request
                return { status: 200, data: { success: true } };

            default:
                return { info: 'Pass-through node' , typeWas: nodeType};
        }
    }
}