
const apiKey = process.env.GEMINI_API_KEY?.trim();
if (!apiKey) { console.error("No Key found in environment"); process.exit(1); }

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    console.log(`Checking models with key ending in ...${apiKey.slice(-4)}`);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error Response:", JSON.stringify(data.error, null, 2));
        } else if (data.models) {
            console.log("\n--- AVAILABLE MODELS FOR THIS KEY ---");
            const usefulModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
            usefulModels.forEach(m => console.log(`Model: ${m.name.replace('models/', '')}`));
        } else {
            console.log("No models returned. Response:", data);
        }
    } catch (e) {
        console.error("Network/Fetch Error:", e);
    }
}

listModels();
