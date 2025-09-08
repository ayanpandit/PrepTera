import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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", // 🔑 paste your key here for quick test
});

async function testTTS() {
  try {
    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: "Hello! This is a test of OpenAI text-to-speech directly from your terminal.",
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync("output.mp3", buffer);

    console.log("✅ TTS complete. File saved as output.mp3");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testTTS();
