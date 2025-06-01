# 📝 AI-Powered Meeting Minutes Extractor

<div align="center">
  <img width="712" alt="Minutes AI Banner" src="https://github.com/user-attachments/assets/3aea7f1d-db42-46ad-b86a-a7cdac3ce981" />
  
  <p><em>Transform raw meeting notes into structured, actionable insights with AI</em></p>
  
  <hr />
</div>

A powerful Node.js backend service integrated with Google's Gemini API that processes meeting notes to extract summaries, key decisions, and action items, returning structured JSON output for seamless integration into your workflow.

## 📋 Overview

<img align="right" width="371" alt="Minutes AI Workflow" src="https://github.com/user-attachments/assets/c809612e-0d3e-4e6c-9f70-b95e4536007a" />

This application accepts meeting notes (either as raw text or a .txt file) and uses Google's Gemini AI to extract:

- ✨ A concise 2-3 sentence summary of the meeting
- 🎯 Key decisions made during the meeting
- ✅ Action items with task details, owners, and deadlines

<br clear="right"/>

## 🚀 Features

- **Dual Input Methods**: Process meeting notes via direct text input or file upload
- **Intelligent Extraction**: Leverages Google's Gemini AI to understand context and extract meaningful information
- **Structured Output**: Returns data in a consistent JSON format for easy integration
- **Error Handling**: Robust error handling for various edge cases
- **Easy Deployment**: Simple setup with minimal configuration

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v14+)
- NPM or Yarn
- Google Gemini API Key ([Get one here](https://https://aistudio.google.com/apikey/))

### Installation

1. Clone the repository or unzip the project files
   ```bash
   git clone <repository-url>
   cd minutes-ai
   ```

2. Install dependencies
   ```bash
   # In the root directory
   npm install
   
   # Or if using Yarn
   yarn install
   ```

3. Create a `.env` file in the backend directory
   ```
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the application
   ```bash
   # Development mode (with auto-restart)
   cd backend
   npm run dev
   
   # OR Production mode
   cd backend
   npm start
   ```

5. Verify the server is running by visiting `http://localhost:5000` in your browser

## 🧪 Testing the API

### Using the Built-in Test Scripts

The application includes test scripts to verify functionality:

```bash
# Test the API endpoints
cd backend
npm run test-api

# Test Gemini API connection
npm run test-gemini
```

### Using Postman

<img width="698" alt="Postman Example" src="https://github.com/user-attachments/assets/68dd768c-1cd4-4035-9f72-3d87f8ff64f1" />

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

<img width="959" alt="cURL Example" src="https://github.com/user-attachments/assets/d6e84a6e-f168-4099-a22e-97e908bf4026" />

#### Text Input Endpoint (Unix/Linux/macOS)

```bash
curl -X POST http://localhost:5000/api/process-meeting \
  -H "Content-Type: application/json" \
  -d "{\"meetingNotes\": \"Team Sync – May 26\\n\\n- We'll launch the new product on June 10.\\n- Ravi to prepare onboarding docs by June 5.\\n- Priya will follow up with logistics team on packaging delay.\\n- Beta users requested a mobile-first dashboard.\"}"
```

#### Text Input Endpoint (Windows PowerShell)

```powershell
curl -Method POST -Uri http://localhost:5000/api/process-meeting -Headers @{"Content-Type"="application/json"} -Body '{"meetingNotes": "Team Sync – May 26\n\n- We''ll launch the new product on June 10.\n- Ravi to prepare onboarding docs by June 5.\n- Priya will follow up with logistics team on packaging delay.\n- Beta users requested a mobile-first dashboard."}' | Select-Object -ExpandProperty Content
```

#### File Upload Endpoint (Unix/Linux/macOS)

```bash
curl -X POST http://localhost:5000/api/process-meeting-file \
  -F "file=@/path/to/sample1.txt"
```

#### File Upload Endpoint (Windows PowerShell)

```powershell
$filePath = "c:\path\to\sample1.txt"
$form = New-Object System.Collections.Specialized.NameValueCollection
$fileBytes = [System.IO.File]::ReadAllBytes($filePath)
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$bodyLines = (
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"sample1.txt`"",
    "Content-Type: text/plain$LF",
    [System.Text.Encoding]::UTF8.GetString($fileBytes),
    "--$boundary--$LF"
) -join $LF

Invoke-RestMethod -Uri "http://localhost:5000/api/process-meeting-file" -Method Post -ContentType "multipart/form-data; boundary=`"$boundary`"" -Body $bodyLines
```

## 📊 Sample Response

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
      "owner": "Priya",
      "due": null
    }
  ]
}
```

## 📁 Sample Files

The repository includes sample meeting notes in the `samples` directory:

- `sample1.txt`: Product team meeting notes
- `sample2.txt`: Weekly team sync notes

You can use these files to test the API without creating your own meeting notes.

## ⚠️ Error Handling

The API includes comprehensive error handling for various scenarios:

### Input Validation Errors (HTTP 400)

- **Missing Text**: When no meeting notes are provided in the request body
  ```json
  { "error": "No meeting text provided" }
  ```

- **Missing File**: When no file is uploaded to the file endpoint
  ```json
  { "error": "No file uploaded" }
  ```

- **Invalid File Type**: When a non-text file is uploaded
  ```json
  { "error": "Only .txt files are allowed" }
  ```

### Server Errors (HTTP 500)

- **Gemini API Errors**: When there are issues with the Gemini API
  ```json
  {
    "error": "Failed to process meeting notes",
    "details": "Error message from Gemini API"
  }
  ```

- **JSON Parsing Errors**: When the AI response cannot be parsed as JSON
  ```json
  {
    "error": "Failed to process meeting notes",
    "details": "Failed to extract JSON from Gemini response"
  }
  ```

### File Size Limits

- Maximum file size: 5MB
- Exceeding this limit will result in a 413 Payload Too Large response

## 🔧 Troubleshooting

### Common Issues

1. **API Key Issues**
   - Ensure your Gemini API key is correctly set in the `.env` file
   - Verify the API key is active and has sufficient quota

2. **Server Won't Start**
   - Check if port 5000 is already in use by another application
   - Verify Node.js version is compatible (v14+)

3. **Request Timeouts**
   - Large meeting notes may take longer to process
   - Consider breaking very large notes into smaller chunks

### Logs

Check the server logs for detailed error information. In development mode, all errors are logged to the console.

## 🔄 API Reference

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/process-meeting` | POST | Process meeting notes from request body |
| `/api/process-meeting-file` | POST | Process meeting notes from uploaded file |
| `/` | GET | Health check endpoint |

### Request Parameters

#### `/api/process-meeting`
- `text` or `meetingNotes`: String containing the meeting notes (Required)

#### `/api/process-meeting-file`
- `file`: .txt file containing meeting notes (Required)

## 📈 Future Enhancements

- Frontend UI for easier interaction
- Support for additional file formats (PDF, DOCX)
- Custom extraction templates
- Authentication for API access
- Webhook notifications for async processing

## 📄 License

ISC

---

<div align="center">
  <p>Made with ❤️ by Swayam for more productive meetings</p>
</div>
