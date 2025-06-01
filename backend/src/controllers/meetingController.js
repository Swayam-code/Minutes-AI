const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

// Initialize Gemini API
const initGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }
  return new GoogleGenerativeAI(apiKey);
};

// Generate prompt for Gemini
const generatePrompt = (meetingText) => {
  return `
You are an expert meeting minutes analyzer. Extract the following information from these meeting notes in a concise, professional manner:

1. A concise summary (1-2 sentences only) focusing on key points, decisions, and action items
2. A list of specific, actionable decisions made (use short, direct phrases starting with action verbs or clear statements)
3. A list of action items with assigned owners and deadlines (if available)

Meeting Notes:
${meetingText}

Format your response STRICTLY as JSON with the following structure and nothing else:
{
  "summary": "A brief, direct summary focusing only on key points",
  "decisions": [
    "Decision 1 in a short, clear phrase", 
    "Decision 2 in a short, clear phrase"
  ],
  "actionItems": [
    {"task": "Specific task description", "owner": "Name", "due": "Date or null if not specified"},
    {"task": "Another task description", "owner": "Name", "due": "Date or null if not specified"}
  ]
}

Guidelines:
- Keep the summary concise and focused on facts, not interpretations
- Format decisions as short, clear statements (e.g., "Launch product on June 10" not "The team decided to launch the product on June 10")
- Extract only explicitly mentioned decisions and action items
- Use null for missing due dates, don't make them up
- Don't include any explanatory text outside the JSON structure
`;
};

// Process meeting notes using Gemini AI
const processWithGemini = async (meetingText) => {
  try {
    const genAI = initGeminiAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
    
    const prompt = generatePrompt(meetingText);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Gemini response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error processing with Gemini:', error);
    throw error;
  }
};

// Controller for processing meeting minutes from request body
exports.processMeeting = async (req, res) => {
  try {
    // Accept either 'text' or 'meetingNotes' field
    const meetingText = req.body.text || req.body.meetingNotes;
    
    if (!meetingText) {
      return res.status(400).json({ error: 'No meeting text provided' });
    }
    
    const result = await processWithGemini(meetingText);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in processMeeting:', error);
    return res.status(500).json({ 
      error: 'Failed to process meeting notes',
      details: error.message 
    });
  }
};

// Controller for processing meeting minutes from file upload
exports.processMeetingFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    
    // Remove the temporary file
    fs.unlinkSync(req.file.path);
    
    const result = await processWithGemini(fileContent);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in processMeetingFile:', error);
    return res.status(500).json({ 
      error: 'Failed to process meeting notes from file',
      details: error.message 
    });
  }
};
