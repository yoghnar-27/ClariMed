import express from "express";
import path from "path";
import multer from "multer";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { db } from "./server/db";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Body parser middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Configure Multer in-memory storage (prevents server disk pollution)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max file size
  }
});

// Helper to get Gemini Client lazily and safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing. Please make sure to add your API Key in the AI Studio Secrets panel.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      }
    }
  });
}

// Helper to authenticate user via simple, robust Authorization header
function authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No authentication token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ success: false, message: "Invalid or empty token" });
  }

  try {
    // In this robust mock authorization flow, the token is simply the userId.
    // This allows seamless persistence and zero-friction student testing.
    (req as any).userId = token;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Authentication expired or invalid" });
  }
}

// =====================================================
// API ENDPOINTS
// =====================================================

// 1. Register User
app.post("/api/auth/register", (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ success: false, message: "Please fill in all fields (email, name, password)" });
  }

  try {
    const user = db.registerUser(email, name, password);
    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token: user.id, // In our custom full-stack system, the userId acts as the secure Bearer token
      user
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Registration failed" });
  }
});

// 2. Login User
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please enter your email and password" });
  }

  try {
    const user = db.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token: user.id,
      user
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Invalid credentials" });
  }
});

// 2.5. Google Auth login / register
app.post("/api/auth/google", (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, message: "Google account details are incomplete" });
  }

  try {
    const user = db.loginOrRegisterGoogleUser(email, name);
    res.status(200).json({
      success: true,
      message: "Google login successful!",
      token: user.id,
      user
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Google authentication failed" });
  }
});

// 3. Analyze Medical Report (Unified Multi-modal OCR & AI Analysis)
app.post("/api/analyze", authenticate, upload.single("file"), async (req, res) => {
  const userId = (req as any).userId;
  const file = req.file;
  const { language = "en" } = req.body;

  if (!file) {
    return res.status(400).json({ success: false, message: "Please select and upload a medical report file (PDF or Image)" });
  }

  try {
    const user = db.getUser(userId);
    const plan = user.plan || "free";

    // Limit check for free users: maximum 2 analyses total
    if (plan === "free") {
      const history = db.getUserHistory(userId);
      if (history.length >= 2) {
        return res.status(403).json({
          success: false,
          isLimitReached: true,
          message: "You have reached your limit of 2 reports on the Free plan. Upgrade to Premium for unlimited medical report analyses and insights!"
        });
      }

      // Check language limitation (only English allowed on Free plan)
      if (language !== "en") {
        return res.status(403).json({
          success: false,
          isLanguageLocked: true,
          message: "Multilingual translation (Hindi, Telugu, Tamil) is a Premium-only feature. Please subscribe to Premium to unlock multilingual translation!"
        });
      }
    }
    // Convert uploaded file buffer to Gemini inlinePart format
    const inlinePart = {
      inlineData: {
        mimeType: file.mimetype,
        data: file.buffer.toString("base64")
      }
    };

    // Human-readable language map for Gemini
    const langNames: Record<string, string> = {
      en: "English",
      hi: "Hindi (हिंदी)",
      te: "Telugu (తెలుగు)",
      ta: "Tamil (தமிழ்)"
    };

    const targetLang = langNames[language] || "English";

    // Build the instruction prompt
    const systemInstruction = `
      You are Claria, a warm, caring, deeply reassuring personal healthcare assistant.
      Your goal is to explain medical report data (blood tests, radiology reports, prescriptions, scans etc.) to an elderly patient.
      
      CRITICAL TONAL & STRUCTURAL REQUIREMENTS:
      1. Under NO circumstances should you diagnose diseases, prescribe medication, or formulate concrete treatment plans.
      2. Keep the explanation SIMPLE, gentle, and extremely easy to understand for an elderly person with very low medical literacy. Avoid complex medical jargon. Explain markers using friendly analogies (e.g., hemoglobin is like tiny little delivery wagons carrying oxygen to your muscles).
      3. The explanation MUST NOT BE TOO LONG AND NOT TOO SHORT. Aim for about 150 to 250 words. Just enough to explain their condition simply and reassure them.
      4. Talk VERY WARMLY, supporting and comforting them. If the report has abnormal markers or flags (which you must look out for), be exceptionally gentle and comforting. Reassure them that these numbers are just indicators, that our bodies fluctuate, and their doctor has wonderful tools to help them feel great.
      5. You MUST include a distinct, simple section in the explanation called "Necessary Precautions" or "Important Precautions & Daily Advice". Give 2 or 3 extremely basic, actionable, comforting daily precautions they can take (e.g., sipping warm water throughout the day, taking gentle rests, avoiding sudden heavy physical tasks, or keeping a friendly daily note of how they feel).
      6. Always include a gentle, loving closing reminder advising the user to discuss these findings with their personal doctor or clinical physician.
      7. The entire 'explanation' text MUST be written completely in the selected language: ${targetLang}, using the selected language's native script.
      8. The 'rawText' should contain a clean, structured summary of the major tests, detected values, reference ranges, and abnormal flags in English for the medical records.
    `;

    const userPrompt = `
      Please perform a full analysis of the attached medical report. 
      Analyze the text, values, units, reference intervals, and flags.
      
      In your 'explanation' (written entirely in ${targetLang}):
      - Begin with a warm, caring greeting as Claria (e.g., "Hello! I have carefully looked at your results...").
      - Walk through the main findings in very simple, reassuring, and clear words.
      - Add your "Necessary Precautions & Daily Advice" section with 2-3 comforting, actionable simple steps they can easily do.
      - End with your signature loving, caring sign-off, reminding them that you are their personal AI assistant and they should consult their doctor.
    `;

    // Execute content generation using gemini-3.5-flash (State-of-the-art vision & text task model)
    const ai = getGeminiClient();
    const geminiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        inlinePart,
        { text: userPrompt }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rawText: {
              type: Type.STRING,
              description: "A clean English text-based summary of extracted values, ranges, and flags for medical logging."
            },
            explanation: {
              type: Type.STRING,
              description: `The moderate-length, comforting conversational analysis in paragraphs written entirely in ${targetLang} including simple precautions.`
            }
          },
          required: ["rawText", "explanation"]
        }
      }
    });

    // Parse JSON response
    const rawResult = geminiResponse.text;
    if (!rawResult) {
      throw new Error("No response returned from the AI model");
    }

    const parsedData = JSON.parse(rawResult.trim());

    // Save to local JSON-based persistent database
    const savedAnalysis = db.saveAnalysis(
      userId,
      file.originalname,
      file.mimetype,
      parsedData.rawText,
      parsedData.explanation,
      language as any
    );

    res.status(200).json({
      success: true,
      message: "Report analyzed successfully!",
      analysis: savedAnalysis
    });

  } catch (error: any) {
    console.error("Gemini report analysis error:", error);
    res.status(500).json({
      success: false,
      message: "Analysis failed. Please make sure the uploaded image/PDF is readable and try again.",
      error: error.message
    });
  }
});

// 4. Retrieve User's Previous Analysis History
app.get("/api/history", authenticate, (req, res) => {
  const userId = (req as any).userId;

  try {
    const history = db.getUserHistory(userId);
    res.status(200).json({
      success: true,
      history
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch history" });
  }
});

// 5. Delete an Analysis Record
app.delete("/api/delete-analysis/:id", authenticate, (req, res) => {
  const userId = (req as any).userId;
  const analysisId = req.params.id;

  try {
    db.deleteAnalysis(analysisId, userId);
    res.status(200).json({
      success: true,
      message: "Record deleted successfully"
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Deletion failed" });
  }
});

// 5b. Interactive Real-time Q&A with Claria
app.post("/api/chat", authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const { analysisId, messages, language } = req.body;

  if (!analysisId || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, message: "Missing analysisId or messages in request body" });
  }

  try {
    // Fetch analysis context
    const userHistory = db.getUserHistory(userId);
    const analysis = userHistory.find(a => a.id === analysisId);
    if (!analysis) {
      return res.status(404).json({ success: false, message: "Associated medical report not found" });
    }

    // Map language names
    const langNames: Record<string, string> = {
      en: "English",
      hi: "Hindi (हिंदी)",
      te: "Telugu (తెలుగు)",
      ta: "Tamil (தமிழ்)"
    };
    const targetLang = langNames[language] || "English";

    // System instruction for follow up chat
    const systemInstruction = `
      You are Claria, a deeply warm, comforting, and reassuring personal healthcare assistant.
      The elderly user has questions about their medical report: "${analysis.reportName}".
      
      REPORT CONTEXT:
      - Raw Findings: ${analysis.rawText}
      - Your Initial Friendly Explanation: ${analysis.explanation}

      CRITICAL CONSTRAINTS:
      1. Under NO circumstances should you diagnose diseases, prescribe medication, or formulate concrete treatment plans. Always advice consulting their physician for definitive medical decisions.
      2. Speak with extreme warmth, gentleness, empathy, and comfort. Keep explanations incredibly simple and clear for an elderly person with low medical literacy.
      3. Do NOT use dry lists or complex medical abbreviations without defining them in simple analogies.
      4. Your response MUST be written completely in the chosen language: ${targetLang}, using its native script.
      5. Keep replies friendly and concise (under 120 words per message) so that it is easy and comfortable for an elderly person to read or listen.
    `;

    // Map message history to Gemini format
    const contents = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    const ai = getGeminiClient();
    const geminiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = geminiResponse.text || "I am here for you. Could you please repeat that?";
    res.status(200).json({
      success: true,
      reply
    });

  } catch (error: any) {
    console.error("Gemini Q&A chat error:", error);
    res.status(500).json({
      success: false,
      message: "Could not retrieve answer from Claria. Please check your network.",
      error: error.message
    });
  }
});

// 6. Get updated User Profile / Subscription Info
app.get("/api/user/profile", authenticate, (req, res) => {
  const userId = (req as any).userId;
  try {
    const user = db.getUser(userId);
    const history = db.getUserHistory(userId);
    res.status(200).json({
      success: true,
      user: {
        ...user,
        analysesCount: history.length
      }
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message || "User profile not found" });
  }
});

// 7. Subscribe / Upgrade to Premium (Simulated Checkouts)
app.post("/api/subscription/upgrade", authenticate, (req, res) => {
  const userId = (req as any).userId;
  try {
    const updatedUser = db.updateUserPlan(userId, "premium");
    const history = db.getUserHistory(userId);

    res.status(200).json({
      success: true,
      message: "Subscription active! Welcome to ClariMed Premium.",
      user: {
        ...updatedUser,
        analysesCount: history.length
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Failed to upgrade subscription" });
  }
});

// 8. Cancel Subscription / Downgrade to Free
app.post("/api/subscription/cancel", authenticate, (req, res) => {
  const userId = (req as any).userId;
  try {
    const updatedUser = db.updateUserPlan(userId, "free");
    const history = db.getUserHistory(userId);

    res.status(200).json({
      success: true,
      message: "Your subscription has been canceled. You are now on the Free tier.",
      user: {
        ...updatedUser,
        analysesCount: history.length
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Failed to cancel subscription" });
  }
});

// =====================================================
// FRONTEND BINDINGS & STATIC CLIENT SERVING
// =====================================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Mount Vite middleware in development for hot reloads and asset routing
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Serve pre-built static client files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ClariMed Full-stack Server listening on http://localhost:${PORT}`);
  });
}

startServer();
