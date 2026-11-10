import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Filter,
  ArrowRight,
  Sparkles,
  Building2,
} from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';

export default function JobListingsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedType !== 'All') params.employmentType = selectedType;
      if (selectedDept !== 'All') params.department = selectedDept;
      if (selectedLevel !== 'All') params.experienceLevel = selectedLevel;

      const res = await api.get('/jobs', { params });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchJobs();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, selectedType, selectedDept, selectedLevel]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Opportunities</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Explore Open Positions
        </h1>
        <p className="text-sm text-slate-500 max-w-xl">
          Discover high-impact engineering, product, and leadership roles at top tech companies.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title, required skills, keywords, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product Design">Product & Design</option>
              <option value="Infrastructure">Infrastructure & Cloud</option>
              <option value="Customer Solutions">Customer Solutions</option>
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Levels</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Lead / Principal">Lead / Principal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results List */}
      {loading ? (
        <LoadingSpinner text="Searching available openings..." />
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.companyName || 'SmartHire Partner'}</span>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                    {job.employmentType}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {job.experienceLevel} ({job.minExperience}+ yrs)
                  </span>
                  {job.salary && job.salary.min > 0 && (
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />$
                      {job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Required Skills Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.requiredSkills?.slice(0, 4).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-2xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills?.length > 4 && (
                    <span className="px-2 py-0.5 rounded-md text-2xs font-medium bg-slate-100 text-slate-600">
                      +{job.requiredSkills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>

                <Link
                  to={`/jobs/${job._id}`}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs matching criteria"
          description="Try broadening your search keywords or resetting filters."
          actionLabel="Reset Search"
          onAction={() => {
            setSearch('');
            setSelectedType('All');
            setSelectedDept('All');
            setSelectedLevel('All');
          }}
        />
      )}
    </div>
  );
}

