import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Kisan Jal Saathi AI Assistant API Route
app.post('/api/assistant', async (req, res) => {
  try {
    const { message, language = 'en', context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'Gemini API key not configured on server',
        fallback: true,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are 'Kisan Jal Saathi' (किसान जल साथी), an expert AgriTech and water intelligence assistant for AeroFlora Systems in India.
Your mission is to assist Indian farmers, agronomists, and Farmer Producer Organisations (FPOs) with:
1. Atmospheric water harvesting (AWH) potential, MOF sorbents (like MOF-801, MIL-101), passive condensation, and diurnal night-sorption/day-desorption cycles.
2. Irrigation planning using FAO-56 Penman-Monteith crop coefficients (Kc) for Indian crops (such as Pomegranate, Bt Cotton, Wheat, Sugarcane, Citrus, Mustard, Chickpea, Onion, Tomato, Mango).
3. Water chemistry: electrical conductivity (EC), total dissolved solids (TDS), Sodium Adsorption Ratio (SAR), Residual Sodium Carbonate (RSC), and solar remineralization with calcite and dolomite minerals.
4. Groundwater conditions: Central Ground Water Board (CGWB) classifications (Safe, Semi-Critical, Critical, Over-Exploited) across Indian states like Rajasthan, Gujarat, Maharashtra, Karnataka, Telangana, Punjab, etc.
5. Financial aspects: PM-KUSUM subsidy schemes (30-50%), replacing expensive tanker water (₹800 to ₹2,500/tanker), diesel pump savings, and cooperative FPO water sharing.

Response Guidelines:
- Language: Respond in ${language === 'hi' ? 'Hindi (हिन्दी)' : 'clear English'} with polite, practical Indian agronomic phrasing.
- If in Hindi, use warm, clear Hindi respectful to Indian farmers (e.g., नमस्ते किसान भाई).
- Keep responses structured, concise, and actionable with bullet points and clear numbers (Litres, Acres, ₹ INR).
- Emphasize that AeroFlora 450 L/day output is an engineered validation target achieved via properly sized sorbent mass (typically 150-250 kg per tower) and diurnal temperature swings, not a magical fixed constant.
- Distinguish between simulated estimates and real lab or telemetry data.`;

    const prompt = `Context: ${JSON.stringify(context || {})}\n\nFarmer Query: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Unable to generate response from model.';
    return res.json({ reply, model: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.error('Kisan Jal Saathi API Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error processing AI query',
      fallback: true,
    });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AeroFlora Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
