const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Notification = require('../models/Notification');

const runSeed = async () => {
  console.log('[Seeder] Cleaning existing collections...');
  await Promise.all([
    User.deleteMany({}),
    CandidateProfile.deleteMany({}),
    RecruiterProfile.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
    Interview.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  console.log('[Seeder] Creating users...');

  // 1. Recruiter User
  const recruiterUser = await User.create({
    name: 'Elena Rostova',
    email: 'recruiter@smarthire.com',
    password: 'password123',
    role: 'recruiter',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  });

  await RecruiterProfile.create({
    user: recruiterUser._id,
    companyName: 'NexaTech Solutions',
    companyWebsite: 'https://nexatech.example.com',
    designation: 'Head of Talent Acquisition',
    department: 'Engineering & People Ops',
    contactPhone: '+1 (555) 789-2041',
    companyOverview:
      'NexaTech Solutions builds next-generation cloud infrastructure, enterprise developer tooling, and intelligent automation platforms.',
  });

  // 2. Candidate Users
  const candidateAlex = await User.create({
    name: 'Alex Morgan',
    email: 'candidate@smarthire.com',
    password: 'password123',
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  });

  const candidateSarah = await User.create({
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    password: 'password123',
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  });

  const candidateDavid = await User.create({
    name: 'David Kumar',
    email: 'david.kumar@example.com',
    password: 'password123',
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  });

  const candidatePriya = await User.create({
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    password: 'password123',
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  });

  const sampleResumeUrl = '/uploads/resumes/sample_alex_morgan_resume.pdf';

  // Candidate Profiles
  const alexProfile = await CandidateProfile.create({
    user: candidateAlex._id,
    fullName: 'Alex Morgan',
    email: 'candidate@smarthire.com',
    phone: '+1 (555) 349-8201',
    location: 'San Francisco, CA',
    headline: 'Senior Full-Stack Software Engineer | React, Node.js, Cloud',
    bio: '5+ years of experience engineering distributed web systems, REST APIs, and responsive frontend architectures.',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'TypeScript', 'Docker', 'AWS', 'Tailwind CSS', 'REST API', 'GraphQL', 'Git'],
    yearsOfExperience: 5,
    resumeUrl: sampleResumeUrl,
    resumeOriginalName: 'Alex_Morgan_Resume.pdf',
    resumeParsedAt: new Date(),
    resumeRawText: 'Alex Morgan Senior Full-Stack Engineer React Node.js MongoDB Docker AWS',
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Berkeley',
        fieldOfStudy: 'Computer Science',
        startYear: '2015',
        endYear: '2019',
        grade: '3.8 GPA',
      },
    ],
    experience: [
      {
        title: 'Senior Full-Stack Developer',
        company: 'Apex Cloud Systems',
        location: 'San Francisco, CA',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        description: 'Engineered web applications using React, Node.js, and MongoDB serving 100K+ monthly active users.',
      },
      {
        title: 'Software Engineer',
        company: 'Horizon Tech Labs',
        location: 'San Jose, CA',
        startDate: '2019',
        endDate: '2022',
        current: false,
        description: 'Designed high-throughput REST APIs with Node.js and automated CI/CD pipelines.',
      },
    ],
  });

  const sarahProfile = await CandidateProfile.create({
    user: candidateSarah._id,
    fullName: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '+1 (555) 621-9943',
    location: 'New York, NY',
    headline: 'Frontend Engineer & UI Specialist | React, Next.js, Tailwind',
    bio: 'Passionate about crafting pixel-perfect web experiences, accessible UI design systems, and fast web apps.',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML', 'CSS', 'Figma', 'Redux', 'Jest', 'UI/UX'],
    yearsOfExperience: 3,
    resumeUrl: sampleResumeUrl,
    resumeOriginalName: 'Sarah_Chen_Frontend_Resume.pdf',
    resumeParsedAt: new Date(),
    education: [
      {
        degree: 'B.S. in Software Engineering',
        institution: 'New York University',
        fieldOfStudy: 'Software Engineering',
        startYear: '2017',
        endYear: '2021',
      },
    ],
  });

  const davidProfile = await CandidateProfile.create({
    user: candidateDavid._id,
    fullName: 'David Kumar',
    email: 'david.kumar@example.com',
    phone: '+1 (555) 883-1290',
    location: 'Austin, TX',
    headline: 'Backend Cloud Engineer | Python, Node.js, PostgreSQL, AWS',
    bio: 'Specializing in backend services, microservices, containerization, and data pipelines.',
    skills: ['Python', 'FastAPI', 'Django', 'Node.js', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Kubernetes', 'Linux', 'Git'],
    yearsOfExperience: 4,
    resumeUrl: sampleResumeUrl,
    resumeOriginalName: 'David_Kumar_Backend_Resume.pdf',
    resumeParsedAt: new Date(),
  });

  const priyaProfile = await CandidateProfile.create({
    user: candidatePriya._id,
    fullName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+1 (555) 412-7809',
    location: 'Chicago, IL',
    headline: 'Full-Stack Developer | MERN Stack & REST APIs',
    bio: 'Enthusiastic developer focused on scalable modern web applications and responsive interfaces.',
    skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'HTML', 'CSS', 'Bootstrap', 'Git', 'REST API'],
    yearsOfExperience: 2,
    resumeUrl: sampleResumeUrl,
    resumeOriginalName: 'Priya_Sharma_Resume.pdf',
    resumeParsedAt: new Date(),
  });

  console.log('[Seeder] Creating job openings...');

  const job1 = await Job.create({
    recruiter: recruiterUser._id,
    companyName: 'NexaTech Solutions',
    title: 'Senior Full Stack Engineer',
    department: 'Core Platform Engineering',
    location: 'San Francisco, CA (Remote)',
    employmentType: 'Full-time',
    experienceLevel: 'Senior Level',
    minExperience: 4,
    salary: { min: 135000, max: 165000, currency: 'USD', period: 'yearly' },
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker', 'REST API'],
    preferredSkills: ['AWS', 'GraphQL', 'Microservices', 'Tailwind CSS'],
    qualifications: [
      'Bachelor’s degree in Computer Science or equivalent practical experience',
      '4+ years of professional full-stack development experience',
      'Proficiency in React.js component architectures and Node.js backend development',
      'Demonstrated ability to design robust MongoDB schema structures and queries',
    ],
    responsibilities: [
      'Architect, build, and deploy high-availability web applications and APIs',
      'Collaborate with product managers and designers to define technical roadmap',
      'Mentor junior developers and participate in code quality reviews',
    ],
    description:
      'We are seeking a talented Senior Full Stack Engineer to lead development of our core web platform. You will build user-facing products with React and maintain scalable REST APIs and services with Node.js and MongoDB.',
    status: 'Published',
    applicationCount: 2,
  });

  const job2 = await Job.create({
    recruiter: recruiterUser._id,
    companyName: 'NexaTech Solutions',
    title: 'Frontend Engineer (React & UI)',
    department: 'Product Design & Frontend',
    location: 'New York, NY (Hybrid)',
    employmentType: 'Full-time',
    experienceLevel: 'Mid Level',
    minExperience: 2,
    salary: { min: 105000, max: 130000, currency: 'USD', period: 'yearly' },
    requiredSkills: ['React', 'JavaScript', 'Tailwind CSS', 'TypeScript', 'HTML', 'CSS'],
    preferredSkills: ['Next.js', 'Figma', 'Jest', 'Redux'],
    qualifications: [
      '2+ years experience building web applications in React',
      'Deep mastery of modern CSS and utility-first frameworks like Tailwind CSS',
      'Strong eye for visual hierarchy, typography, and responsive micro-interactions',
    ],
    responsibilities: [
      'Develop responsive web views and reusable component libraries',
      'Optimize page performance, Lighthouse scores, and accessibility standards',
    ],
    description:
      'Join our Frontend engineering squad to craft sleek, accessible, high-performance dashboards and client web tools.',
    status: 'Published',
    applicationCount: 1,
  });

  const job3 = await Job.create({
    recruiter: recruiterUser._id,
    companyName: 'NexaTech Solutions',
    title: 'Backend Cloud & Python Engineer',
    department: 'Infrastructure & APIs',
    location: 'Austin, TX',
    employmentType: 'Full-time',
    experienceLevel: 'Mid Level',
    minExperience: 3,
    salary: { min: 115000, max: 145000, currency: 'USD', period: 'yearly' },
    requiredSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS', 'REST API'],
    preferredSkills: ['Kubernetes', 'Linux', 'Node.js', 'Redis'],
    qualifications: [
      '3+ years backend software development experience with Python',
      'Hands-on experience deploying cloud containers on AWS',
    ],
    responsibilities: [
      'Construct low-latency microservices and RESTful API endpoints',
      'Manage PostgreSQL database performance and migration scripts',
    ],
    description:
      'Looking for a passionate backend engineer to expand our distributed data APIs and cloud services.',
    status: 'Published',
    applicationCount: 1,
  });

  const job4 = await Job.create({
    recruiter: recruiterUser._id,
    companyName: 'NexaTech Solutions',
    title: 'Associate MERN Stack Developer',
    department: 'Customer Solutions',
    location: 'Chicago, IL',
    employmentType: 'Full-time',
    experienceLevel: 'Entry Level',
    minExperience: 1,
    salary: { min: 75000, max: 95000, currency: 'USD', period: 'yearly' },
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
    preferredSkills: ['Tailwind CSS', 'Git', 'REST API'],
    qualifications: [
      '1+ years experience or portfolio of full-stack JavaScript applications',
      'Knowledge of React state management and Express routing',
    ],
    responsibilities: [
      'Implement internal tools and client portal features',
      'Write unit tests and debug application issues',
    ],
    description:
      'Great opportunity for motivated developers to grow within our engineering organization building full-stack web solutions.',
    status: 'Published',
    applicationCount: 1,
  });

  const job5 = await Job.create({
    recruiter: recruiterUser._id,
    companyName: 'NexaTech Solutions',
    title: 'Principal Software Architect',
    department: 'Office of the CTO',
    location: 'San Francisco, CA (Remote)',
    employmentType: 'Full-time',
    experienceLevel: 'Lead / Principal',
    minExperience: 8,
    salary: { min: 180000, max: 230000, currency: 'USD', period: 'yearly' },
    requiredSkills: ['System Design', 'Microservices', 'AWS', 'Docker', 'Kubernetes'],
    preferredSkills: ['Go', 'TypeScript', 'Distributed Systems'],
    qualifications: ['8+ years engineering experience with large scale cloud distributed systems'],
    responsibilities: ['Define technical architecture roadmap across engineering squads'],
    description: 'Strategic leadership role setting the technical blueprint for NexaTech platforms.',
    status: 'Draft',
    applicationCount: 0,
  });

  console.log('[Seeder] Creating realistic candidate applications with match scores...');

  const app1 = await Application.create({
    job: job1._id,
    candidate: candidateAlex._id,
    candidateProfile: alexProfile._id,
    resumeUrl: sampleResumeUrl,
    coverLetter:
      'I have 5 years of full-stack engineering experience delivering React and Node.js solutions at scale. NexaTech’s mission aligns directly with my background in cloud systems.',
    matchScore: {
      score: 92,
      matchedSkills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker', 'REST API', 'AWS', 'Tailwind CSS'],
      missingSkills: [],
      experienceMatch: true,
      explanation: 'Excellent candidate profile: Matches 6/6 required skills (React, Node.js, MongoDB, TypeScript, Docker, REST API) plus preferred AWS and Tailwind expertise. Exceeds required 4 years experience with 5 years.',
      breakdown: {
        skillsScore: 95,
        experienceScore: 100,
        keywordScore: 88,
      },
    },
    status: 'Interview Scheduled',
    statusHistory: [
      {
        status: 'Applied',
        updatedBy: candidateAlex._id,
        updatedAt: new Date(Date.now() - 6 * 24 * 3600 * 1000),
        notes: 'Candidate submitted online application.',
      },
      {
        status: 'Under Review',
        updatedBy: recruiterUser._id,
        updatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000),
        notes: 'Resume passed initial ATS screening with 92% match score.',
      },
      {
        status: 'Shortlisted',
        updatedBy: recruiterUser._id,
        updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        notes: 'Profile shortlisted for Technical Round 1.',
      },
      {
        status: 'Interview Scheduled',
        updatedBy: recruiterUser._id,
        updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
        notes: 'Technical Interview scheduled for Nov 8 at 14:00.',
      },
    ],
    recruiterNotes: 'Very strong candidate. Impressive open-source projects and cloud experience.',
    appliedAt: new Date(Date.now() - 6 * 24 * 3600 * 1000),
  });

  const app2 = await Application.create({
    job: job2._id,
    candidate: candidateSarah._id,
    candidateProfile: sarahProfile._id,
    resumeUrl: sampleResumeUrl,
    coverLetter:
      'Passionate frontend specialist with 3 years of experience with React, Tailwind CSS, and Figma design tokens.',
    matchScore: {
      score: 88,
      matchedSkills: ['React', 'JavaScript', 'Tailwind CSS', 'TypeScript', 'HTML', 'CSS', 'Next.js', 'Figma'],
      missingSkills: [],
      experienceMatch: true,
      explanation: 'Matches all required frontend skills with strong Tailwind and TypeScript foundations. 3 years experience meets the 2-year criteria.',
      breakdown: {
        skillsScore: 92,
        experienceScore: 100,
        keywordScore: 78,
      },
    },
    status: 'Shortlisted',
    statusHistory: [
      {
        status: 'Applied',
        updatedBy: candidateSarah._id,
        updatedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
        notes: 'Applied via SmartHire Job Portal.',
      },
      {
        status: 'Under Review',
        updatedBy: recruiterUser._id,
        updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
        notes: 'Reviewed portfolio and design systems work.',
      },
      {
        status: 'Shortlisted',
        updatedBy: recruiterUser._id,
        updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
        notes: 'Shortlisted for candidate interview.',
      },
    ],
    appliedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
  });

  const app3 = await Application.create({
    job: job3._id,
    candidate: candidateDavid._id,
    candidateProfile: davidProfile._id,
    resumeUrl: sampleResumeUrl,
    coverLetter: 'Experienced backend developer focusing on FastAPI, Docker containers, and AWS architectures.',
    matchScore: {
      score: 85,
      matchedSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS', 'REST API', 'Linux'],
      missingSkills: [],
      experienceMatch: true,
      explanation: 'Strong backend profile: 6/6 required skills matched, meets 3 years experience requirement with 4 years.',
      breakdown: {
        skillsScore: 90,
        experienceScore: 100,
        keywordScore: 72,
      },
    },
    status: 'Under Review',
    statusHistory: [
      {
        status: 'Applied',
        updatedBy: candidateDavid._id,
        updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
        notes: 'Application submitted.',
      },
      {
        status: 'Under Review',
        updatedBy: recruiterUser._id,
        updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
        notes: 'Engineering team reviewing backend code samples.',
      },
    ],
    appliedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
  });

  const app4 = await Application.create({
    job: job4._id,
    candidate: candidatePriya._id,
    candidateProfile: priyaProfile._id,
    resumeUrl: sampleResumeUrl,
    coverLetter: 'Excited to bring my full-stack MERN skills to NexaTech Solutions.',
    matchScore: {
      score: 84,
      matchedSkills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git', 'REST API'],
      missingSkills: [],
      experienceMatch: true,
      explanation: 'All required MERN stack competencies confirmed. 2 years experience exceeds entry-level requirement.',
      breakdown: {
        skillsScore: 88,
        experienceScore: 100,
        keywordScore: 70,
      },
    },
    status: 'Selected',
    statusHistory: [
      {
        status: 'Applied',
        updatedBy: candidatePriya._id,
        updatedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000),
        notes: 'Application registered.',
      },
      {
        status: 'Interview Scheduled',
        updatedBy: recruiterUser._id,
        updatedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
        notes: 'Completed technical interview.',
      },
      {
        status: 'Selected',
        updatedBy: recruiterUser._id,
        updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
        notes: 'Offer extended and accepted!',
      },
    ],
    appliedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000),
  });

  const app5 = await Application.create({
    job: job1._id,
    candidate: candidateSarah._id,
    candidateProfile: sarahProfile._id,
    resumeUrl: sampleResumeUrl,
    matchScore: {
      score: 71,
      matchedSkills: ['React', 'TypeScript', 'Tailwind CSS'],
      missingSkills: ['Node.js', 'MongoDB', 'Docker'],
      experienceMatch: false,
      explanation: 'Candidate has strong React skills but missing backend requirements (Node.js, MongoDB, Docker). Experience (3 yrs) is slightly below 4 yrs requirement.',
      breakdown: {
        skillsScore: 50,
        experienceScore: 75,
        keywordScore: 80,
      },
    },
    status: 'Under Review',
    statusHistory: [
      {
        status: 'Applied',
        updatedBy: candidateSarah._id,
        updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        notes: 'Application received.',
      },
    ],
    appliedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
  });

  console.log('[Seeder] Scheduling interviews...');

  await Interview.create([
    {
      application: app1._id,
      job: job1._id,
      candidate: candidateAlex._id,
      recruiter: recruiterUser._id,
      title: 'Technical Round 1: React & System Architecture',
      round: 'Technical Round 1',
      interviewDate: new Date(Date.now() + 4 * 24 * 3600 * 1000),
      startTime: '14:00',
      endTime: '15:00',
      type: 'Online',
      meetingLink: 'https://meet.google.com/smarthire-alex-tech',
      notes: 'Prepare to discuss state management, API design, and MongoDB indexing strategies.',
      status: 'Scheduled',
    },
    {
      application: app2._id,
      job: job2._id,
      candidate: candidateSarah._id,
      recruiter: recruiterUser._id,
      title: 'UI Engineering & Component Design Review',
      round: 'Technical Round 1',
      interviewDate: new Date(Date.now() + 5 * 24 * 3600 * 1000),
      startTime: '11:00',
      endTime: '12:00',
      type: 'Online',
      meetingLink: 'https://meet.google.com/smarthire-sarah-ui',
      notes: 'Reviewing recent Figma-to-React implementations and accessibility best practices.',
      status: 'Scheduled',
    },
  ]);

  console.log('[Seeder] Creating notifications...');

  await Notification.create([
    {
      recipient: recruiterUser._id,
      title: 'New High Match Applicant! 🎯',
      message: 'Alex Morgan applied for Senior Full Stack Engineer with a 92% ATS match score.',
      type: 'new_application',
      link: '/recruiter/applicants',
    },
    {
      recipient: candidateAlex._id,
      title: 'Interview Scheduled! 📅',
      message: 'Your interview for Senior Full Stack Engineer has been confirmed.',
      type: 'interview_scheduled',
      link: '/candidate/interviews',
    },
    {
      recipient: candidateSarah._id,
      title: 'Application Shortlisted! 🎉',
      message: 'Congratulations! Your application for Frontend Engineer has been shortlisted.',
      type: 'status_update',
      link: '/candidate/applications',
    },
  ]);

  console.log('[Seeder] Done seeding database.');
};

module.exports = { runSeed };

