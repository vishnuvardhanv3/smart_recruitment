import React, { useState, useEffect } from 'react';
import {
  FileUp,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Cpu,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ResumeUploadPage() {
  const { profile, refreshProfile } = useAuth();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (profile?.parsedData) {
      setParsedData(profile.parsedData);
    }
  }, [profile]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') {
        setError('Please select a valid PDF file (.pdf).');
        return;
      }
      setFile(selected);
      setError('');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.type !== 'application/pdf') {
        setError('Only PDF resumes are supported.');
        return;
      }
      setFile(dropped);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      return setError('Please choose a PDF file to upload.');
    }

    setUploading(true);
    setError('');
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMsg('Resume parsed and profile updated successfully!');
      setParsedData(res.data.parsedData);
      setFile(null);
      await refreshProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload or parse resume.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5" />
          <span>PyMuPDF Natural Language Parser</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Resume Parser & Uploader
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
          Upload your PDF resume. Our backend Python script extracts your core skills, work history,
          and degrees to power automatic job matching across the platform.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-800">
          {profile?.resumeUrl ? 'Replace or Update Your Resume' : 'Upload Your PDF Resume'}
        </h3>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Drag Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive
              ? 'border-indigo-600 bg-indigo-50/50'
              : file
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <FileUp className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">
                {file ? file.name : 'Drag & drop your resume PDF here'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {file
                  ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for parsing`
                  : 'PDF format only, up to 10MB'}
              </p>
            </div>

            <div>
              <input
                id="resume-file-input"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="resume-file-input"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors inline-block"
              >
                Browse PDF Files
              </label>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {file && (
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Extracting Resume with PyMuPDF...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Upload & Run AI Parsing
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Extracted Intelligence Display */}
      {parsedData && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Extracted Candidate Dossier</h3>
                <p className="text-xs text-slate-500">Structured data saved to your ATS candidate profile</p>
              </div>
            </div>

            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:underline"
              >
                View PDF File <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Extracted Name</span>
              <span className="font-bold text-slate-800 text-sm">{parsedData.fullName || profile?.fullName}</span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Contact Info</span>
              <span className="font-medium text-slate-800 block">{parsedData.email || profile?.email}</span>
              <span className="font-medium text-slate-500 block">{parsedData.phone || profile?.phone || 'No phone'}</span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Detected Experience</span>
              <span className="font-bold text-slate-800 text-sm">
                {parsedData.yearsOfExperience || profile?.yearsOfExperience || 0} Years
              </span>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Extracted Technical Skills ({parsedData.skills?.length || 0})
            </h4>
            <div className="flex flex-wrap gap-2">
              {(parsedData.skills || profile?.skills || []).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          {parsedData.education?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Education Credentials
              </h4>
              <div className="space-y-2">
                {parsedData.education.map((edu, idx) => (
                  <div key={idx} className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">{edu.degree}</span>
                      <span className="text-slate-500">{edu.institution}</span>
                    </div>
                    {edu.endYear && <span className="text-slate-400 font-medium">{edu.endYear}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

