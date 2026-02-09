
import { GoogleGenerativeAI } from "@google/generative-ai";

const key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(key);

async function test(modelName) {
    console.log(`Testing ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        console.log(`Success with ${modelName}:`, await result.response.text());
    } catch (err) {
        console.error(`Failed with ${modelName}:`, err.message);
        if (err.response) console.error("Details:", JSON.stringify(err.response, null, 2));
    }
}

async function run() {
    await test("gemini-1.5-flash");
    await test("gemini-pro");
}

run();
