# AI-Powered Meeting Minutes Extractor

A Node.js backend service integrated with Google's Gemini API that processes meeting notes to extract summaries, key decisions, and action items, returning structured JSON output.

## 📋 Overview

This application accepts meeting notes (either as raw text or a .txt file) and uses Google's Gemini AI to extract:

- A 2-3 sentence summary of the meeting
- Key decisions made during the meeting
- Action items with task details, owners, and deadlines

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v14+)
- NPM
- Google Gemini API Key

### Installation

1. Clone the repository or unzip the project files
   ```
   git clone <repository-url>
   cd minutes-ai
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory
   ```
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the application
   ```
   # Development mode (with auto-restart)
   cd backend
   npm run dev
   
   # OR Production mode
   cd backend
   npm start
   ```

## 🧪 Testing the API

### Using Postman

#### Text Input Endpoint

1. Create a new POST request to `http://localhost:5000/api/process-meeting`
2. Set the Content-Type header to `application/json`
3. In the request body (raw JSON), enter:
   ```json
   {
     "meetingNotes": "Team Sync – May 26\n\n- We'll launch the new product on June 10.\n- Ravi to prepare onboarding docs by June 5.\n- Priya will follow up with logistics team on packaging delay.\n- Beta users requested a mobile-first dashboard."
   }
   ```
   or
   ```json
   {
     "text": "Team Sync – May 26\n\n- We'll launch the new product on June 10.\n- Ravi to prepare onboarding docs by June 5.\n- Priya will follow up with logistics team on packaging delay.\n- Beta users requested a mobile-first dashboard."
   }
   ```
4. Send the request

#### File Upload Endpoint

1. Create a new POST request to `http://localhost:5000/api/process-meeting-file`
2. In the Body tab, select form-data
3. Add a key named `file` and change the type to File
4. Select one of the sample .txt files from the samples directory
5. Send the request

### Using cURL

#### Text Input Endpoint

```bash
curl -X POST http://localhost:5000/api/process-meeting \
  -H "Content-Type: application/json" \
  -d "{\"meetingNotes\": \"Team Sync – May 26\\n\\n- We'll launch the new product on June 10.\\n- Ravi to prepare onboarding docs by June 5.\\n- Priya will follow up with logistics team on packaging delay.\\n- Beta users requested a mobile-first dashboard.\"}"
```

#### File Upload Endpoint

```bash
curl -X POST http://localhost:5000/api/process-meeting-file \
  -F "file=@/path/to/sample1.txt"
```

### Using Postman

1. Create a new POST request to `http://localhost:5000/api/process-meeting`
2. For text input:
   - Set Content-Type to `application/json`
   - In the body tab, select "raw" and "JSON"
   - Add your meeting notes in the format: `{"text": "Your meeting notes here..."}`

3. For file upload:
   - Set Content-Type to `multipart/form-data`
   - In the body tab, select "form-data"
   - Add a key named "file" with type "File"
   - Select your .txt file

## Sample Response

```json
{
  "summary": "The team confirmed the product launch on June 10, assigned onboarding preparation and logistics follow-up, and discussed user feedback on mobile design.",
  "decisions": [
    "Launch set for June 10",
    "Need mobile-first dashboard for beta users"
  ],
  "actionItems": [
    {
      "task": "Prepare onboarding docs",
      "owner": "Ravi",
      "due": "June 5"
    },
    {
      "task": "Follow up with logistics team",
      "owner": "Priya"
    }
  ]
}
```

## Sample Files

The repository includes sample meeting notes in the `samples` directory:

- `sample1.txt`: Product team meeting notes
- `sample2.txt`: Weekly team sync notes

## Error Handling

The API handles various error scenarios:

- Missing input text or file
- Invalid file format (only .txt files are accepted)
- Gemini API errors
- File size limits (5MB max)

## License

MIT
