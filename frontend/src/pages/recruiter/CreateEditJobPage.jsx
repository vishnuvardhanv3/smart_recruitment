import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  ArrowLeft,
  Plus,
  X,
  Save,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function CreateEditJobPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'San Francisco, CA (Remote)',
    employmentType: 'Full-time',
    experienceLevel: 'Mid Level',
    minExperience: 2,
    salary: {
      min: 100000,
      max: 130000,
      currency: 'USD',
      period: 'yearly',
    },
    description: '',
    status: 'Published',
    requiredSkills: ['React', 'Node.js', 'MongoDB'],
    preferredSkills: ['TypeScript', 'Docker', 'AWS'],
    qualifications: [
      'Bachelor’s degree in Computer Science or related practical experience',
      '2+ years experience building production web applications',
    ],
    responsibilities: [
      'Design, build, and maintain efficient, reusable, and reliable code',
      'Collaborate with cross-functional teams to ship user-facing features',
    ],
  });

  // Inputs for tag adders
  const [skillInput, setSkillInput] = useState('');
  const [prefSkillInput, setPrefSkillInput] = useState('');
  const [qualInput, setQualInput] = useState('');
  const [respInput, setRespInput] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchJob = async () => {
        try {
          const res = await api.get(`/jobs/${id}`);
          const job = res.data.job;
          setFormData({
            title: job.title || '',
            department: job.department || 'Engineering',
            location: job.location || '',
            employmentType: job.employmentType || 'Full-time',
            experienceLevel: job.experienceLevel || 'Mid Level',
            minExperience: job.minExperience || 0,
            salary: job.salary || { min: 0, max: 0, currency: 'USD', period: 'yearly' },
            description: job.description || '',
            status: job.status || 'Published',
            requiredSkills: job.requiredSkills || [],
            preferredSkills: job.preferredSkills || [],
            qualifications: job.qualifications || [],
            responsibilities: job.responsibilities || [],
          });
        } catch (err) {
          setError('Failed to fetch job data: ' + err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('salary.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        salary: { ...prev.salary, [field]: field.includes('min') || field.includes('max') ? Number(value) : value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addTag = (field, value, setter) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));
    setter('');
  };

  const removeTag = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.requiredSkills.length === 0) {
      return setError('Please provide at least one required skill for the ATS matcher.');
    }

    setSubmitting(true);
    setError('');

    try {
      if (isEditing) {
        await api.put(`/jobs/${id}`, formData);
      } else {
        await api.post('/jobs', formData);
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job opening.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading job editor..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/recruiter/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Job Postings
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isEditing ? 'Edit Job Opening' : 'Create New Job Opening'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Specify candidate requirements and core competencies to configure automated ATS matching.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Senior Full-Stack Engineer"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="Core Platform Engineering">Core Platform Engineering</option>
                <option value="Product Design & Frontend">Product Design & Frontend</option>
                <option value="Infrastructure & APIs">Infrastructure & APIs</option>
                <option value="Customer Solutions">Customer Solutions</option>
                <option value="Data & Machine Learning">Data & Machine Learning</option>
              </select>
            </div>
          </div>

          {/* Location, Type, Experience Level, Min Exp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. San Francisco, CA (Remote)"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 bg-white"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 bg-white"
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead / Principal">Lead / Principal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Min Experience (Yrs)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                name="minExperience"
                value={formData.minExperience}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 bg-white"
              />
            </div>
          </div>

          {/* Salary & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Min Salary ($)</label>
              <input
                type="number"
                name="salary.min"
                value={formData.salary.min}
                onChange={handleChange}
                placeholder="100000"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Max Salary ($)</label>
              <input
                type="number"
                name="salary.max"
                value={formData.salary.max}
                onChange={handleChange}
                placeholder="140000"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Posting Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-semibold text-indigo-700"
              >
                <option value="Published">Published (Accepting Candidates)</option>
                <option value="Draft">Draft (Saved Internally)</option>
                <option value="Closed">Closed (Position Filled)</option>
              </select>
            </div>
          </div>

          {/* Required Skills Tag Adder (ATS critical) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Required Technical Skills (Used for ATS matching 55% weight)
              </label>
              <span className="text-2xs text-slate-400">Press Add or Enter</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag('requiredSkills', skillInput, setSkillInput);
                  }
                }}
                placeholder="e.g. React, Node.js, TypeScript, Docker..."
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
              />
              <button
                type="button"
                onClick={() => addTag('requiredSkills', skillInput, setSkillInput)}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.requiredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeTag('requiredSkills', idx)}
                    className="hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Skills Tag Adder */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Preferred Skills (Bonus matching criteria)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prefSkillInput}
                onChange={(e) => setPrefSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag('preferredSkills', prefSkillInput, setPrefSkillInput);
                  }
                }}
                placeholder="e.g. AWS, GraphQL, Tailwind CSS..."
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
              />
              <button
                type="button"
                onClick={() => addTag('preferredSkills', prefSkillInput, setPrefSkillInput)}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700"
              >
                Add Bonus
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.preferredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeTag('preferredSkills', idx)}
                    className="hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Outline role responsibilities, team environment, and day-to-day impact..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 bg-white"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Link
              to="/recruiter/jobs"
              className="px-5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving Opening...' : isEditing ? 'Update Job' : 'Publish Job Opening'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

