import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateAndSave(prompt, filename) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        fs.writeFileSync(`public/${filename}`, Buffer.from(base64Data, 'base64'));
        console.log(`Saved ${filename}`);
        return;
      }
    }
  } catch (e) {
    console.error(`Failed to generate ${filename}:`, e.message);
  }
}

async function main() {
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
  }
  await generateAndSave('Abstract conceptual art representing future film and cinematography, dark, moody, neon accents, highly detailed, 8k', 'bg1.jpg');
  await generateAndSave('Abstract fluid liquid metal with cinematic lighting, dark background, fashion tech vibe', 'bg2.jpg');
  await generateAndSave('Abstract 3D geometry melting into darkness, holographic film projection, futuristic', 'bg3.jpg');
  await generateAndSave('Cinematic lens flare and light leaks in deep space, abstract, moody, dark studio lighting', 'bg4.jpg');
}
main();
