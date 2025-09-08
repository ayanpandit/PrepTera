import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const app = express();

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Debug: Log if API key is loaded
console.log('API Key loaded:', GEMINI_API_KEY ? 'Yes' : 'No');
console.log('API Key length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);

// Validate API key
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables");
  console.error("Please check your .env file in the backend directory");
  process.exit(1);
}

// In-memory session store (simple for now)
let sessions = {};

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "PrepTera Backend API", 
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Step 1: Start interview
app.post("/start", async (req, res) => {
  try {
    const { jobRole, domain, interviewType } = req.body;
    
    // Validate input
    if (!jobRole || !domain || !interviewType) {
      return res.status(400).json({ error: "Missing required fields: jobRole, domain, interviewType" });
    }

    const sessionId = Date.now().toString();

    // Fallback questions in case API fails
    const fallbackQuestions = [
      "Tell me about yourself and your background.",
      "Why are you interested in this position?",
      "What are your greatest strengths?",
      "Describe a challenging project you worked on.",
      "How do you handle working under pressure?",
      "What are your career goals for the next 5 years?",
      "Tell me about a time you had to learn something new quickly.",
      "How do you approach problem-solving?",
      "Describe your experience working in a team.",
      "Do you have any questions for us?"
    ];

    let questions = fallbackQuestions; // Start with fallback

    try {
      // Try to get questions from Gemini API
      const prompt = `You are an expert interviewer conducting a ${interviewType.toLowerCase()} interview for a ${jobRole} position in ${domain}. 

Generate exactly 10 high-quality, relevant interview questions. Each question should be:
- Appropriate for the ${interviewType.toLowerCase()} interview type
- Relevant to the ${jobRole} role and ${domain} domain
- Progressive in difficulty
- Designed to assess key competencies

Format your response as a numbered list (1., 2., 3., etc.) with only the questions, no additional text or explanations.`;

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY
        },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        
        // Parse questions more reliably
        const apiQuestions = text
          .split(/\d+\.\s+/)
          .filter(q => q.trim() !== "")
          .map(q => q.trim())
          .slice(0, 10); // Ensure we only get 10 questions

        if (apiQuestions.length > 0) {
          questions = apiQuestions; // Use API questions if available
          console.log('Using AI-generated questions');
        } else {
          console.log('API returned empty questions, using fallback');
        }
      } else {
        const errorText = await response.text();
        console.log('API Error response:', errorText);
        console.log('Using fallback questions due to API error');
      }
    } catch (apiError) {
      console.log('API call failed, using fallback questions:', apiError.message);
    }

    // Save session
    sessions[sessionId] = {
      jobRole,
      domain,
      interviewType,
      questions,
      answers: [],
      currentIndex: 0,
      startTime: new Date(),
    };

    console.log(`Started interview session ${sessionId} for ${jobRole} - ${domain} (${interviewType})`);
    
    res.json({ 
      sessionId, 
      firstQuestion: questions[0],
      totalQuestions: questions.length
    });

  } catch (error) {
    console.error("Error starting interview:", error);
    res.status(500).json({ 
      error: "Failed to start interview. Please try again.", 
      details: error.message 
    });
  }
});

// Step 2: Answer question and get next
app.post("/answer", (req, res) => {
  try {
    const { sessionId, answer } = req.body;
    
    // Validate input
    if (!sessionId || !answer) {
      return res.status(400).json({ error: "Missing sessionId or answer" });
    }

    const session = sessions[sessionId];
    if (!session) {
      return res.status(400).json({ error: "Invalid or expired session" });
    }

    // Save the answer
    session.answers.push({ 
      question: session.questions[session.currentIndex], 
      answer: answer.trim(),
      timestamp: new Date()
    });
    
    session.currentIndex++;

    console.log(`Session ${sessionId}: Answered question ${session.currentIndex}/${session.questions.length}`);

    if (session.currentIndex < session.questions.length) {
      res.json({ 
        nextQuestion: session.questions[session.currentIndex],
        questionNumber: session.currentIndex + 1,
        totalQuestions: session.questions.length
      });
    } else {
      res.json({ 
        message: "Interview complete. Please call /feedback.",
        isComplete: true
      });
    }
  } catch (error) {
    console.error("Error processing answer:", error);
    res.status(500).json({ error: "Failed to process answer" });
  }
});

// Step 3: Get feedback
app.post("/feedback", async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const session = sessions[sessionId];
    if (!session) {
      return res.status(400).json({ error: "Invalid or expired session" });
    }

    const qaPairs = session.answers.map(
      (x, i) => `${i + 1}. Q: ${x.question}\nA: ${x.answer}`
    ).join("\n\n");

    const prompt = `You are an expert interviewer providing detailed feedback for a ${session.interviewType.toLowerCase()} interview.

Interview Details:
- Role: ${session.jobRole}
- Domain: ${session.domain}
- Interview Type: ${session.interviewType}

Candidate's Responses:
${qaPairs}

Please provide a comprehensive evaluation including:

1. **Overall Performance**: Brief summary of the candidate's performance
2. **Strengths**: Key areas where the candidate excelled
3. **Areas for Improvement**: Specific areas that need development
4. **Technical/Domain Knowledge**: Assessment of relevant expertise (if applicable)
5. **Communication Skills**: How well the candidate articulated their thoughts
6. **Recommendations**: Actionable advice for improvement
7. **Overall Rating**: Rate the performance on a scale of 1-10 with justification

Please be constructive, specific, and provide actionable feedback that will help the candidate improve.`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY
      },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Feedback API Error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate feedback at this time.";

    console.log(`Generated feedback for session ${sessionId}`);
    
    res.json({ 
      feedback,
      sessionInfo: {
        jobRole: session.jobRole,
        domain: session.domain,
        interviewType: session.interviewType,
        totalQuestions: session.questions.length,
        startTime: session.startTime,
        endTime: new Date()
      }
    });

    // Clean up session after feedback (optional - you might want to keep for analytics)
    setTimeout(() => {
      delete sessions[sessionId];
      console.log(`Cleaned up session ${sessionId}`);
    }, 300000); // Delete after 5 minutes

  } catch (error) {
    console.error("Error generating feedback:", error);
    res.status(500).json({ 
      error: "Failed to generate feedback. Please try again.",
      details: error.message
    });
  }
});

// Run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
