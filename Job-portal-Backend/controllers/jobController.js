const Job = require('../models/Job');

// Create a new job
exports.createJob = async (req, res) => {
  try {
    const { position, ctc, openings, department, technologies, location } = req.body;

    const job = new Job({
      position,
      ctc,
      openings,
      department,
      technologies,
      location
    });

    await job.save();
    res.status(201).json({ message: 'Job created successfully', job });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating job' });
  }
};

// Get all jobs with sorting and filtering
exports.getAllJobs = async (req, res) => {
  try {
    const { department, sortBy } = req.query;

    let filter = { openings: { $gt: 0 } }; // Filter to get only jobs with available openings
    
    // Apply filter for department
    if (department && department !== 'all') {
      filter.department = department;
    }

    // Apply sorting
    const sortCriteria = {};
    if (sortBy) {
      if (sortBy === 'asc') {
        sortCriteria.ctc = 1;  // Sort ascending by ctc
      } else if (sortBy === 'desc') {
        sortCriteria.ctc = -1; // Sort descending by ctc
      }
    }

    // Fetch jobs based on filters and sorting
    const jobs = await Job.find(filter).sort(sortCriteria);
    res.json(jobs);

  } catch (err) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
};
