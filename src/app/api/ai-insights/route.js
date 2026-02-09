
// Mock database interface - in real app, this would query your MongoDB/Postgres
import { complaints } from '@/utils/mockData';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure the key is trimmed to remove accidental whitespace from copy-pasting
const apiKey = process.env.GEMINI_API_KEY?.trim();
const genAI = new GoogleGenerativeAI(apiKey);

// Simple Server-Side Cache to prevent hitting rate limits (5 RPM) during demos
// Persists as long as the server process is running
let aiCache = {
    text: null,
    timestamp: 0
};

export async function POST(req) {
    try {
        // 1. Check Cache (Valid for 15 minutes to survive Rate Limits)
        const CACHE_DURATION = 15 * 60 * 1000;
        if (aiCache.text && (Date.now() - aiCache.timestamp < CACHE_DURATION)) {
            return Response.json({ insight: aiCache.text + " (Cached)" });
        }

        const { filter } = await req.json();

        // 2. Filter Data for Context
        let relevantComplaints = complaints;
        if (filter && filter !== 'All') {
            relevantComplaints = complaints.filter(c => c.status === filter);
        }

        // Limit data scope to avoid token limits for this demo (e.g., send summarized stats)
        // For production, you'd aggregate data first (e.g., "Ward 12 has 5 pending potholes").
        const summaryStats = {
            total: relevantComplaints.length,
            byCategory: {},
            byWard: {},
            byDept: {}
        };

        relevantComplaints.forEach(c => {
            summaryStats.byCategory[c.category] = (summaryStats.byCategory[c.category] || 0) + 1;
            summaryStats.byWard[c.ward] = (summaryStats.byWard[c.ward] || 0) + 1;
            summaryStats.byDept[c.department] = (summaryStats.byDept[c.department] || 0) + 1;
        });

        // 3. Construct Prompt (Updated for Weekly Report & Specific Statuses)
        const prompt = `
        You are an AI assistant for a civic management system. Analyze the following complaint data summary:
        ${JSON.stringify(summaryStats, null, 2)}
        
        Task: Provide a "Weekly Issues Report" for the Admins.
        1. Summarize: What are the main civic problems reported this week?
        2. Status Breakdown: Mention how many are "New Complaints", "Under Working" (In Progress), and "Unresolved" (Pending).
        3. Critical Focus: Which department is under the most pressure right now?
        
        Keep the tone professional yet urgent. Max 4 sentences.
        `;

        // 4. Call Gemini (Using Flash Lite for high speed and better rate limits)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Update Cache
        aiCache = {
            text: text,
            timestamp: Date.now()
        };

        return Response.json({ insight: text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return Response.json({
            insight: `AI Analysis unavailable: ${error.message || "Unknown error"}. (Check API Key)`
        }, { status: 500 });
    }
}
