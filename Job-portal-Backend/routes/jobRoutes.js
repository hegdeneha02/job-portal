const express = require('express');
const router = express.Router();
const { createJob, getAllJobs } = require('../controllers/jobController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

router.post('/', authenticate, authorizeAdmin, createJob);
router.get('/', authenticate, getAllJobs); // open to all authenticated users

module.exports = router;
