import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Send,
  AlertCircle,
  FileText,
  UserCheck,
  Check,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import ScoreBreakdownModal from '../components/ScoreBreakdownModal';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCandidate, isRecruiter } = useAuth();

  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [submittedScore, setSubmittedScore] = useState(null);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data.job);
      setHasApplied(res.data.hasApplied);
      setApplicationStatus(res.data.applicationStatus);

      if (isCandidate) {
        const pRes = await api.get('/profile');
        setCandidateProfile(pRes.data.profile);
      }
    } catch (err) {
      setError('Job posting not found or has been removed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id, isCandidate]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!candidateProfile?.resumeUrl) {
      return navigate('/candidate/resume');
    }

    setApplying(true);
    setError('');

    try {
      const res = await api.post('/applications', {
        jobId: job._id,
        coverLetter,
      });

      setHasApplied(true);
      setApplicationStatus('Applied');
      if (res.data.application?.matchScore) {
        setSubmittedScore(res.data.application.matchScore);
        setShowScoreModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading position details..." fullScreen />;
  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">{error || 'Job not found'}</h2>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to job openings
        </Link>
      </div>
    );
  }

  const hasResume = !!candidateProfile?.resumeUrl;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to all listings
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {job.department}
              </span>
              <StatusBadge status={job.status} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {job.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{job.companyName || 'SmartHire Enterprise'}</span>
            </div>
          </div>

          {hasApplied && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Already Applied ({applicationStatus})</span>
            </div>
          )}
        </div>

        {/* Key Metrics Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Location</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {job.location}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Employment Type</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-500" /> {job.employmentType}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Experience Level</span>
            <span className="font-semibold text-slate-800 block mt-0.5">
              {job.experienceLevel} ({job.minExperience}+ yrs)
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Compensation</span>
            <span className="font-semibold text-emerald-700 block mt-0.5">
              {job.salary && job.salary.min > 0
                ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()} / ${job.salary.period}`
                : 'Competitive Salary'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Application Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Job Specs */}
        <div className="lg:col-span-2 space-y-8">
          {/* About the role */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Role Overview
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </section>

          {/* Required & Preferred Skills */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Skills & Technologies
            </h3>

            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-2">
                Required Core Skills
              </span>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {job.preferredSkills?.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-2">
                  Preferred / Nice-to-Have
                </span>
                <div className="flex flex-wrap gap-2">
                  {job.preferredSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Key Responsibilities */}
          {job.responsibilities?.length > 0 && (
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-3 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Key Responsibilities
              </h3>
              <ul className="space-y-2">
                {job.responsibilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Qualifications */}
          {job.qualifications?.length > 0 && (
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-3 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Candidate Qualifications
              </h3>
              <ul className="space-y-2">
                {job.qualifications.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Col: Action Box */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs sticky top-24 space-y-5">
            <h3 className="text-base font-bold text-slate-900">Apply for this Position</h3>

            {hasApplied ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900">Application Active</h4>
                  <p className="text-xs text-emerald-700">
                    Your resume has been submitted and is in the recruiter ATS queue.
                  </p>
                  <div className="pt-2">
                    <StatusBadge status={applicationStatus} />
                  </div>
                </div>

                <Link
                  to="/candidate/applications"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  Track in My Applications
                </Link>
              </div>
            ) : isCandidate ? (
              <div className="space-y-4">
                {!hasResume ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3 text-xs text-amber-800">
                    <div className="flex items-center gap-2 font-semibold text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      Resume Upload Required
                    </div>
                    <p className="leading-relaxed">
                      Please upload your PDF resume so our automated parser can verify your skills and compute your match score.
                    </p>
                    <Link
                      to="/candidate/resume"
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      Upload PDF Resume Now
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <span className="text-slate-400 font-medium block">Attached Resume:</span>
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="truncate">{candidateProfile.resumeOriginalName || 'Uploaded Resume.pdf'}</span>
                      </div>
                      <Link to="/candidate/resume" className="text-2xs text-indigo-600 hover:underline block pt-1">
                        Change / re-upload resume
                      </Link>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Cover Note (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Brief note to the hiring team..."
                        className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={applying}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {applying ? 'Evaluating & Applying...' : 'Submit Application'}
                    </button>
                  </form>
                )}
              </div>
            ) : isRecruiter ? (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-800 space-y-3">
                <span className="font-semibold block">You are signed in as a Recruiter.</span>
                <p>You can manage this posting and review candidate applicants in your ATS pipeline.</p>
                <Link
                  to={`/recruiter/applicants?jobId=${job._id}`}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  View Applicants for this Job
                </Link>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
                <p className="text-xs text-slate-600">
                  Please log in as a candidate to apply for this opening.
                </p>
                <Link
                  to="/login"
                  state={{ from: { pathname: `/jobs/${job._id}` } }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  Log In to Apply
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Score Modal on Application Submission */}
      {submittedScore && (
        <ScoreBreakdownModal
          isOpen={showScoreModal}
          onClose={() => setShowScoreModal(false)}
          matchScore={submittedScore}
          candidateName={user?.name}
          jobTitle={job.title}
        />
      )}
    </div>
  );
}

