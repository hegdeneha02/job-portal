const express = require('express');
const router = express.Router();
const { applyToJob, updateApplicationStatus, getUserApplications, previewResume ,getAllApplications} = require('../controllers/applicationController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const multer = require('multer');


// File upload configuration with multer
// This will store files in memory

// Apply to job (with file upload)

router.post('/apply', authenticate, upload.single('resume'), applyToJob);

// Update application status (admin only)
router.put('/update/:applicationId', authenticate, authorizeAdmin, updateApplicationStatus);

// Get all applications of a user
router.get('/applications', authenticate, getUserApplications);

// Preview the resume of an application
router.get('/resume/:applicationId', authenticate, previewResume);
router.get('/view-application', authenticate, authorizeAdmin, getAllApplications);

module.exports = router;
