import { Workflow } from "../models/Workflow";
import { connectDB } from "./db";
import nodemailer from 'nodemailer';
import 'dotenv/config';

export class ExecutionEngine {
    private context: any = {};

    async runWorkflow(workflowId: string) {
        await connectDB();
        const workflow = await Workflow.findById(workflowId);
        if (!workflow) throw new Error('Workflow not found');

        const { nodes, edges } = workflow;

        const startNode = nodes.find((n: any) => n.type === 'input' || n.type === 'trigger');
        if (!startNode) throw new Error('Start node not found!');

        console.log(`[Engine] Starting workflow ${workflowId}`);
        const queue = [startNode];

        while (queue.length > 0) {
            const currentNode = queue.shift();
            if (!currentNode) break;

            const nodeType = currentNode.data?.jobType || currentNode.type;

            // 1. GATHER INPUTS
            const incomingEdges = edges.filter((edge: any) => edge.target === currentNode.id);
            const inputData = incomingEdges.reduce((acc: any, edge: any) => {
                const parentResult = this.context[edge.source];
                return { ...acc, ...parentResult }; 
            }, {});

            try {
                // 2. PASS INPUTS
                const output = await this.executeNode(currentNode, inputData);
                this.context[currentNode.id] = output;
                console.log(`[Engine] Node ${nodeType} finished.`);
            } catch (err: any) {
                console.error(`[Engine] Node ${currentNode.id} failed:`, err.message);
                break;
            }

            // 3. TRAVERSE
            const connectedEdges = edges.filter((edge: any) => edge.source === currentNode.id);
            for (const edge of connectedEdges) {
                if (nodeType === 'condition') {
                    const result = this.context[currentNode.id]?.result;
                    const requiredHandle = result ? 'true' : 'false';
                    if (edge.sourceHandle !== requiredHandle) continue; 
                }
                const nextNode = nodes.find((n: any) => n.id === edge.target);
                if (nextNode) queue.push(nextNode);
            }
        }
        
        return { status: 'completed', context: this.context };
    }

    private async executeNode(node: any, inputData: any) {
        const nodeType = node.data?.jobType || node.type;

        switch (nodeType) {
            case 'input':
            case 'trigger':
                // MOCK DATA
                return { 
                    triggeredAt: new Date().toISOString(),
                    userName: "Minh",
                    userEmail: "legacyofvall@gmail.com" 
                };
            
            case 'condition':
                console.log(`   [Logic] Checking if '${inputData.userName}' === 'Minh'...`);
                const isMinh = inputData.userName === 'Minh';
                return { ...inputData, result: isMinh };
            
            case 'http': // Use http as the email sender (in this MVP only)
                if (!inputData.userEmail) {
                    console.log("   [Action] No email address found to send to.");
                    return { sent: false };
                }

                console.log(`   [Action] Attempting to send REAL email via Gmail...`);

                // NODEMAILER SETUP
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASS,
                    },
                });

                const mailOptions = {
                    from: process.env.GMAIL_USER,
                    to: inputData.userEmail,
                    subject: 'Workflow Notification',
                    text: `Hello ${inputData.userName},\n\nThis is an automated message from your n8n-mvp workflow engine.\n\nApproval Status: GRANTED`,
                };

                try {
                    const info = await transporter.sendMail(mailOptions);
                    console.log('   [Action] Email Sent: ' + info.response);
                    return { sent: true, messageId: info.messageId };
                } catch (error: any) {
                    console.error('   [Action] Email Failed:', error);
                    throw error;
                }

            case 'agent':
                return { text: `AI processed: ${inputData.userName}`, model: 'gpt-4'};

            default:
                return { info: 'Pass-through' };
        }
    }
}