
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Error: GEMINI_API_KEY is missing/undefined in process.env");
        return;
    }

    console.log("Testing API Key:", apiKey.substring(0, 10) + "...");

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, strictly reply 'Working' if you receive this.");
        const response = await result.response;
        console.log("Success! Response:", response.text());
    } catch (error) {
        console.error("API Error:", error.message);
    }
}

run();
