import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  PlusCircle,
  Search,
  Users,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  MapPin,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { myJobs: 'true' };
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/jobs', { params });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Failed to load recruiter jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, search]);

  const handleToggleStatus = async (jobId, currentStatus) => {
    const nextStatus = currentStatus === 'Published' ? 'Closed' : 'Published';
    try {
      await api.put(`/jobs/${jobId}`, { status: nextStatus });
      fetchJobs();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/jobs/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchJobs();
    } catch (err) {
      alert('Failed to delete job: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Job Openings Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, publish or close positions and track applicant pipeline volume.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/create"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Post New Opening
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search job postings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 bg-white"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Published', 'Draft', 'Closed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === s
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Fetching job requisitions..." />
      ) : jobs.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-2xs font-semibold">
                  <th className="py-3 px-5">Job Title & Dept</th>
                  <th className="py-3 px-5">Location & Type</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Applicants</th>
                  <th className="py-3 px-5">Date Created</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div>
                        <span className="font-bold text-slate-900 block">{job.title}</span>
                        <span className="text-2xs text-indigo-600 font-medium">
                          {job.department}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="text-slate-700">
                        <span className="block font-medium">{job.location}</span>
                        <span className="text-2xs text-slate-400">{job.employmentType}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <StatusBadge status={job.status} />
                    </td>

                    <td className="py-3.5 px-5">
                      <Link
                        to={`/recruiter/applicants?jobId=${job._id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors"
                        title="View applicants for this job"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicationCount || 0}</span>
                      </Link>
                    </td>

                    <td className="py-3.5 px-5 text-slate-400 text-2xs">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-5 text-right space-x-1">
                      {/* View Applicants button */}
                      <Link
                        to={`/recruiter/applicants?jobId=${job._id}`}
                        className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100 inline-block transition-colors"
                        title="View Applicants"
                      >
                        <Users className="w-4 h-4" />
                      </Link>

                      {/* Edit job */}
                      <Link
                        to={`/recruiter/jobs/edit/${job._id}`}
                        className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100 inline-block transition-colors"
                        title="Edit Job"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      {/* Toggle status (Publish / Close) */}
                      <button
                        onClick={() => handleToggleStatus(job._id, job.status)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer inline-block ${
                          job.status === 'Published'
                            ? 'text-amber-600 hover:bg-amber-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={job.status === 'Published' ? 'Close job' : 'Publish job'}
                      >
                        {job.status === 'Published' ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteTarget(job)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 inline-block transition-colors cursor-pointer"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No job openings found"
          description="You haven't posted any jobs in this category yet."
          actionLabel="Post New Job"
          onAction={() => (window.location.href = '/recruiter/jobs/create')}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Delete Job Posting?</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete <strong>"{deleteTarget.title}"</strong>? Associated
                applications and interview records will also be removed.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

