import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Sparkles,
  Building2,
  ArrowRight,
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function BrowseJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [dept, setDept] = useState('All');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (type !== 'All') params.employmentType = type;
      if (dept !== 'All') params.department = dept;

      const res = await api.get('/jobs', { params });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Failed to load candidate jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, type, dept]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Browse Open Positions
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-2xs font-bold border border-indigo-200">
              {jobs.length} Positions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Apply with 1-click using your parsed resume profile and get instant ATS match scores.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search title, skills, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>

          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product Design">Product & Design</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Customer Solutions">Customer Solutions</option>
          </select>
        </div>
      </div>

      {/* Job Cards Grid */}
      {loading ? (
        <LoadingSpinner text="Searching active opportunities..." />
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.companyName || 'SmartHire Enterprise'}</span>
                    </div>
                  </div>
                  <span className="text-2xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
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
                  {job.salary?.min > 0 && (
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />$
                      {job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills tags */}
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
                      +{job.requiredSkills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-2xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>

                <Link
                  to={`/jobs/${job._id}`}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  View & Apply <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No open jobs found"
          description="Try relaxing your search terms or clearing the selected department filter."
          actionLabel="Reset Search"
          onAction={() => {
            setSearch('');
            setType('All');
            setDept('All');
          }}
        />
      )}
    </div>
  );
}

