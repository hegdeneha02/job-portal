const Application = require('../models/Application');
const Job = require('../models/Job');
const sendMail = require('../utils/sendMail');

exports.applyToJob = async (req, res) => {
  try {
    const { fullName, email, phone, address, dateOfBirth, gender, education, experience, jobId } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
   
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Check if user already applied
    const alreadyApplied = await Application.findOne({ userId: req.user.id, jobId });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job.' });
    }

    // Create new application with resume
    const application = new Application({
      userId: req.user.id,
      jobId,
      resume: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      personalDetails: {
        fullName,
        email,
        phone,
        address,
        dateOfBirth,
        gender,
        education,
        experience
      }
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};
exports.updateApplicationStatus = async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { status } = req.body; // 'approved' or 'rejected'
  
      const application = await Application.findById(applicationId).populate('jobId userId');
      if (!application) return res.status(404).json({ message: 'Application not found' });
  
      if (application.status !== 'pending') {
        return res.status(400).json({ message: 'Application already reviewed' });
      }
  
      application.status = status;
  
      // Decrement job opening if approved
      if (status === 'Approved') {
        const job = await Job.findById(application.jobId._id);
        if (job.openings > 0) {
          job.openings -= 1;
          await job.save();
        } else {
          return res.status(400).json({ message: 'No more openings available' });
        }
  
        // Send approval email
        await sendMail({
          to: application.personalDetails.email,
          subject: `Application Approved - ${job.position}`,
          text: `Dear ${application.personalDetails.fullName},\n\nYour application for ${job.position} has been approved.\n\nRegards,\nHR Team`
        });
      }
  
      await application.save();
      res.json({ message: `Application ${status} successfully.` });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update application status' });
    }
  };
  exports.getUserApplications = async (req, res) => {
    try {
      const applications = await Application.find({ userId: req.user.id })
        .populate('jobId', 'position department location') // Include job info
        .select('-resume'); // exclude resume buffer
  
      res.json(applications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch applications' });
    }
  };
  exports.previewResume = async (req, res) => {
    try {
      const { applicationId } = req.params;
  
      const application = await Application.findById(applicationId);
      if (!application || !application.resume || !application.resume.data) {
        return res.status(404).json({ message: 'Resume not found' });
      }
  
      res.contentType(application.resume.contentType);
      res.send(application.resume.data);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to preview resume' });
    }
  };
  exports.getAllApplications = async (req, res) => {
    try {
      const applications = await Application.find({ status: 'pending' })
        .populate('jobId', 'position department location')
        .populate('userId', 'fullName email') // Optional: show user info
        .select('-resume'); // Exclude resume blob for listing
  
      res.json(applications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch all applications' });
    }
  };
  