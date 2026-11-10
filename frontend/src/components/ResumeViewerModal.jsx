import React, { useState } from 'react';
import { X, FileText, Download, ExternalLink, Cpu, CheckCircle, GraduationCap, Briefcase, Mail, Phone } from 'lucide-react';

export default function ResumeViewerModal({ isOpen, onClose, resumeUrl, candidateProfile, candidateName }) {
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'parsed'

  if (!isOpen) return null;

  const profile = candidateProfile || {};
  const skills = profile.skills || [];
  const education = profile.education || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {candidateName ? `${candidateName}'s Resume` : 'Candidate Resume'}
              </h3>
              <p className="text-xs text-slate-500">
                {profile.headline || 'Verified PDF Application Document'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab switch */}
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'preview'
                    ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                PDF Document
              </button>
              <button
                onClick={() => setActiveTab('parsed')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
                  activeTab === 'parsed'
                    ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                Parsed ATS Data
              </button>
            </div>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Open in new window"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 bg-slate-100 overflow-hidden relative">
          {activeTab === 'preview' ? (
            resumeUrl ? (
              <iframe
                src={`${resumeUrl}#toolbar=1&view=FitH`}
                title="Resume PDF Preview"
                className="w-full h-full border-none bg-white"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6">
                <FileText className="w-12 h-12 mb-2 text-slate-300" />
                <p className="text-sm font-medium">No PDF file attached to this profile.</p>
              </div>
            )
          ) : (
            /* Parsed ATS View */
            <div className="p-6 overflow-y-auto h-full bg-white space-y-6">
              {/* Quick Contact & Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Full Name</span>
                  <p className="text-sm font-semibold text-slate-800">{profile.fullName || candidateName || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email Address
                  </span>
                  <p className="text-sm font-medium text-slate-800">{profile.email || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Phone Number
                  </span>
                  <p className="text-sm font-medium text-slate-800">{profile.phone || 'N/A'}</p>
                </div>
              </div>

              {/* Skills Section */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-indigo-500" />
                  NLP Extracted Technical Skills ({skills.length})
                </h4>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No skills parsed.</p>
                )}
              </div>

              {/* Experience */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  Extracted Experience ({profile.yearsOfExperience || 0} years)
                </h4>
                {profile.experience && profile.experience.length > 0 ? (
                  <div className="space-y-3">
                    {profile.experience.map((exp, idx) => (
                      <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-semibold text-sm text-slate-800">{exp.title}</span>
                            <span className="text-slate-500 text-xs block">{exp.company} • {exp.location || 'Remote'}</span>
                          </div>
                          <span className="text-xs text-slate-400">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    Detected ~{profile.yearsOfExperience || 1} years of cumulative software development experience from resume timeline.
                  </p>
                )}
              </div>

              {/* Education */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-500" />
                  Extracted Education
                </h4>
                {education.length > 0 ? (
                  <div className="space-y-2">
                    {education.map((edu, idx) => (
                      <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 flex justify-between items-center">
                        <div>
                          <div className="text-xs font-semibold text-slate-800">{edu.degree}</div>
                          <div className="text-xs text-slate-500">{edu.institution} {edu.grade ? `• ${edu.grade}` : ''}</div>
                        </div>
                        {edu.endYear && <span className="text-xs text-slate-400">{edu.endYear}</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No education entries found.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex justify-between items-center bg-slate-50">
          <span className="text-xs text-slate-500">
            PyMuPDF + NLP Parser v2.4 • SmartHire ATS
          </span>
          {resumeUrl && (
            <a
              href={resumeUrl}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

