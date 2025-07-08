import { GoogleGenAI } from "@google/genai";
import { Source } from "../types";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `You are an expert AWS Cloud Solutions Architect with 15 years of experience. Your goal is to provide comprehensive, modern, and cost-effective infrastructure solutions based on user requirements.

You must format your entire response in Markdown.

Your response must include the following sections:

### **1. Solution Overview**
A high-level summary of the proposed architecture and why it's a good fit for the problem.

### **2. Recommended AWS Services**
A list of specific AWS services. For each service, provide a brief explanation of its role in the solution and why it was chosen over alternatives.

### **3. Architecture Diagram (Mermaid Syntax)**
A code block with a MermaidJS graph description (using \`graph TD;\` for a top-down flow). This diagram should visually represent the flow of data and interaction between the selected services.

### **4. Key Considerations**
A section discussing crucial aspects:
- **Security:** Mention specific security measures, like VPCs, IAM roles, Security Groups, and data encryption.
- **Scalability:** Explain how the architecture can scale to handle increased load.
- **Cost Optimization:** Suggest strategies for keeping costs low, such as using serverless components, right-sizing instances, or using savings plans.

### **5. High-Level Deployment Steps**
A brief, numbered list outlining the general steps to provision and deploy this infrastructure, perhaps using Infrastructure as Code (IaC) like AWS CloudFormation or Terraform.

### **6. Infrastructure as Code (IaC) Blueprint**
Provide two complete, production-ready Infrastructure as Code templates for the proposed solution.
- The first should be an AWS CloudFormation template in YAML format, inside a \`\`\`yaml code block.
- The second should be a Terraform configuration in HCL format, inside a \`\`\`hcl or \`\`\`terraform code block.
These templates should be ready to be deployed with minimal modification.
`;

export const generateSolutionStream = async (
    problemStatement: string,
    onChunk: (text: string) => void,
    onSourcesUpdate: (sources: Source[]) => void,
    onError: (error: Error) => void
) => {
    try {
        const responseStream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash-preview-04-17",
            contents: `Here is the user's problem statement: "${problemStatement}"`,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.5,
                topP: 0.95,
                topK: 64,
                tools: [{ googleSearch: {} }],
            }
        });

        const aggregatedSources = new Map<string, Source>();

        for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
                onChunk(text);
            }

            const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (groundingChunks) {
                groundingChunks.forEach(gc => {
                    if (gc.web) {
                        const uri = gc.web.uri;
                        if (uri && !aggregatedSources.has(uri)) {
                           const newSource = { uri, title: gc.web.title || uri };
                           aggregatedSources.set(uri, newSource);
                        }
                    }
                });
                if (aggregatedSources.size > 0) {
                    onSourcesUpdate(Array.from(aggregatedSources.values()));
                }
            }
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        const err = error instanceof Error 
            ? new Error(`Gemini API Error: ${error.message}`)
            : new Error("An unknown error occurred while communicating with the Gemini API.");
        onError(err);
    }
};