import React from 'react';
import { X, CheckCircle, AlertTriangle, Sparkles, Briefcase, Zap, Info } from 'lucide-react';

export default function ScoreBreakdownModal({ isOpen, onClose, matchScore, candidateName, jobTitle }) {
  if (!isOpen || !matchScore) return null;

  const {
    score = 0,
    matchedSkills = [],
    missingSkills = [],
    experienceMatch = true,
    explanation = '',
    breakdown = { skillsScore: 70, experienceScore: 80, keywordScore: 75 },
  } = matchScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">ATS Match Analysis</h3>
              <p className="text-xs text-slate-500">
                {candidateName ? `${candidateName} • ` : ''}{jobTitle || 'Job Evaluation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Score Hero */}
          <div className="bg-linear-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-indigo-200 uppercase tracking-wider">Overall Match Score</span>
              <div className="text-3xl font-extrabold tracking-tight mt-0.5">{score}%</div>
              <p className="text-xs text-slate-300 mt-1">Calculated via multi-factor ATS keyword algorithm</p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-indigo-400/30 flex items-center justify-center bg-indigo-500/20">
              <Sparkles className="w-8 h-8 text-indigo-300" />
            </div>
          </div>

          {/* Explanation Quote */}
          {explanation && (
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 flex gap-2.5 items-start">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{explanation}</p>
            </div>
          )}

          {/* Subscore Progress Bars */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Score Composition Breakdown</h4>

            {/* Skills Factor */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-500" /> Skills Relevance (55% Weight)
                </span>
                <span className="text-slate-900 font-semibold">{breakdown.skillsScore || 0}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, breakdown.skillsScore || 0)}%` }}
                />
              </div>
            </div>

            {/* Experience Factor */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Experience Level (25% Weight)
                </span>
                <span className="text-slate-900 font-semibold">{breakdown.experienceScore || 0}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, breakdown.experienceScore || 0)}%` }}
                />
              </div>
            </div>

            {/* Keyword Factor */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Context & Keyword Density (20% Weight)
                </span>
                <span className="text-slate-900 font-semibold">{breakdown.keywordScore || 0}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, breakdown.keywordScore || 0)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Matched Skills */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Matched Skills & Keywords ({matchedSkills.length})</span>
            </div>
            {matchedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {matchedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No direct required skills matched.</p>
            )}
          </div>

          {/* Missing Skills */}
          {missingSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Identified Skill Gaps ({missingSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200"
                  >
                    <AlertTriangle className="w-3 h-3 text-rose-500" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}

