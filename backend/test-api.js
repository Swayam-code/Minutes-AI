const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Configuration
const API_URL = 'http://localhost:5000/api';
const SAMPLE_FILE_PATH = path.join(__dirname, '../samples/sample1.txt');
const SAMPLE_TEXT = `Team Sync – May 26

- We'll launch the new product on June 10.
- Ravi to prepare onboarding docs by June 5.
- Priya will follow up with logistics team on packaging delay.
- Beta users requested a mobile-first dashboard.`;

// Test API with text input
async function testTextInput() {
  try {
    console.log('Testing API with text input...');
    const response = await axios.post(`${API_URL}/process-meeting`, {
      text: SAMPLE_TEXT
    });
    
    console.log('\nAPI Response (Text Input):');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error testing text input:', error.response?.data || error.message);
  }
}

// Test API with file upload
async function testFileUpload() {
  try {
    console.log('\nTesting API with file upload...');
    
    // Check if sample file exists
    if (!fs.existsSync(SAMPLE_FILE_PATH)) {
      console.error(`Sample file not found: ${SAMPLE_FILE_PATH}`);
      return;
    }
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream(SAMPLE_FILE_PATH));
    
    const response = await axios.post(`${API_URL}/process-meeting-file`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    console.log('\nAPI Response (File Upload):');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error testing file upload:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('=== Testing Meeting Minutes Extractor API ===\n');
  await testTextInput();
  await testFileUpload();
  console.log('\n=== Tests Completed ===');
}

runTests();
