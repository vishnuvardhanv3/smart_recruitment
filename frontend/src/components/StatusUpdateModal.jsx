import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

const statuses = [
  { value: 'Applied', desc: 'Application received and pending review' },
  { value: 'Under Review', desc: 'Resume and profile are currently under evaluation' },
  { value: 'Shortlisted', desc: 'Candidate passed initial filter and is ready for next steps' },
  { value: 'Interview Scheduled', desc: 'Interview invitations have been dispatched' },
  { value: 'Selected', desc: 'Candidate has been selected / offered the role' },
  { value: 'Rejected', desc: 'Candidate was not selected for this position' },
];

export default function StatusUpdateModal({ isOpen, onClose, application, onSuccess }) {
  if (!isOpen || !application) return null;

  const [selectedStatus, setSelectedStatus] = useState(application.status || 'Applied');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/applications/${application._id}/status`, {
        status: selectedStatus,
        notes: notes.trim() || `Status updated to ${selectedStatus}`,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Update Application Status</h3>
            <p className="text-xs text-slate-500">
              {application.candidate?.name} • {application.job?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Select Status</label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {statuses.map((s) => (
                <label
                  key={s.value}
                  className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                    selectedStatus === s.value
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s.value}
                    checked={selectedStatus === s.value}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">{s.value}</span>
                    <span className="text-2xs text-slate-500">{s.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Internal Evaluation Notes (optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Strong technical answers in phone screen. Moving to technical round."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

