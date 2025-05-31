require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Check if API key is provided
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Error: GEMINI_API_KEY is not defined in environment variables');
  console.log('Please create a .env file in the backend directory with your Gemini API key:');
  console.log('GEMINI_API_KEY=your_api_key_here');
  process.exit(1);
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(apiKey);

// Sample meeting notes
const sampleNotes = `Team Sync – May 26

- We'll launch the new product on June 10.
- Ravi to prepare onboarding docs by June 5.
- Priya will follow up with logistics team on packaging delay.
- Beta users requested a mobile-first dashboard.`;

// Generate prompt for Gemini
const generatePrompt = (meetingText) => {
  return `
Extract the following information from these meeting notes:
1. A 2-3 sentence summary of the meeting
2. A list of key decisions made
3. A list of action items with assigned owners and deadlines (if available)

Meeting Notes:
${meetingText}

Format your response as JSON with the following structure:
{
  "summary": "...",
  "decisions": ["...", "..."],
  "actionItems": [
    {"task": "...", "owner": "...", "due": "..."},
    {"task": "...", "owner": "...", "due": "..."}
  ]
}
`;
};

// Test Gemini API
async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API connection...');
    console.log('Using sample meeting notes:');
    console.log('----------------------------');
    console.log(sampleNotes);
    console.log('----------------------------\n');

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
    const prompt = generatePrompt(sampleNotes);
    
    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Gemini response');
    }
    
    const data = JSON.parse(jsonMatch[0]);
    
    console.log('\nAPI Response:');
    console.log('-------------');
    console.log(JSON.stringify(data, null, 2));
    console.log('-------------\n');
    
    console.log('✅ Gemini API test successful!');
    console.log('You can now run the full application.');
    
    return data;
  } catch (error) {
    console.error('❌ Error testing Gemini API:', error.message);
    if (error.message.includes('API key')) {
      console.log('\nPlease check that your API key is valid and has been correctly set in the .env file.');
    } else {
      console.log('\nPlease check your internet connection and try again.');
    }
  }
}

// Run the test
testGeminiAPI();
