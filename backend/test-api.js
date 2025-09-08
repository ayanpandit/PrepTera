import fetch from 'node-fetch';

const GEMINI_API_KEY = "AIzaSyBR7QUmZ8zcoExm0jctCisIZr9JjRaGUfY";

// Test different API endpoints
const endpoints = [
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`
];

const testPayload = {
    contents: [{ parts: [{ text: "Say hello" }] }],
    generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 100,
    }
};

async function testEndpoint(url, name) {
    console.log(`\n=== Testing ${name} ===`);
    console.log('URL:', url);
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testPayload)
        });

        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Success! Response:', JSON.stringify(data, null, 2));
        } else {
            const errorText = await response.text();
            console.log('Error Response:', errorText);
        }
    } catch (error) {
        console.log('Request failed:', error.message);
    }
}

async function main() {
    await testEndpoint(endpoints[0], 'gemini-1.5-flash');
    await testEndpoint(endpoints[1], 'gemini-pro');
    await testEndpoint(endpoints[2], 'gemini-1.5-pro');
}

main();
