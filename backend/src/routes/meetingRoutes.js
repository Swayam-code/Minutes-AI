const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const upload = require('../middleware/upload');

// Route for processing meeting minutes (text in request body)
router.post('/process-meeting', meetingController.processMeeting);

// Route for processing meeting minutes (file upload)
router.post('/process-meeting-file', upload.single('file'), meetingController.processMeetingFile);

module.exports = router;
