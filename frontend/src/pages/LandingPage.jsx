import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  FileCheck,
  CheckCircle2,
  Calendar,
  BarChart3,
  ShieldCheck,
  Search,
  Briefcase,
  Users,
  Cpu,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { login, isAuthenticated, isRecruiter } = useAuth();
  const navigate = useNavigate();

  const handleQuickRecruiterDemo = async () => {
    try {
      await login('recruiter@smarthire.com', 'password123');
      navigate('/recruiter/dashboard');
    } catch (e) {
      navigate('/login');
    }
  };

  const handleQuickCandidateDemo = async () => {
    try {
      await login('candidate@smarthire.com', 'password123');
      navigate('/candidate/dashboard');
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-8 border-b border-slate-200/60 bg-gradient-to-b from-white via-slate-50/50 to-[#F8FAFC]">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation ATS with Natural Language Parsing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Recruitment made smart, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600">
              transparent & effortless.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            SmartHire pairs automated PyMuPDF resume parsing with multi-factor keyword matching,
            seamless pipeline tracking, and one-click interview scheduling.
          </p>

          {/* Quick Demo CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleQuickRecruiterDemo}
              className="px-6 py-3 bg-[#111827] hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-indigo-400" />
              Demo as Recruiter
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleQuickCandidateDemo}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-indigo-200" />
              Demo as Candidate
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/jobs"
              className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-slate-500" />
              Browse Open Jobs
            </Link>
          </div>

          {/* Demo Credentials Note */}
          <div className="pt-2">
            <span className="text-2xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Preloaded with 4 users, open positions, candidate applications & scheduled interviews
            </span>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            Core Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Engineered for modern talent acquisition
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A cohesive intermediate full-stack system built with clean Separation of Concerns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Python Resume Parsing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated PDF text extraction via PyMuPDF. Extracts candidate name, email, phone, skills,
              years of experience, and degrees instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Transparent Match Scoring</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates 0-100 score based on 55% skill relevance, 25% experience threshold, and 20%
              keyword density. No black-box rejection.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">6-Stage ATS Pipeline</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track candidates from Applied → Under Review → Shortlisted → Interview Scheduled →
              Selected / Rejected with full audit history.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Integrated Interviews</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Schedule technical and HR rounds, generate Google Meet links or offline room directions,
              and notify candidates automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Flow Demonstration */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-[#111827] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
                ATS Workflow
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                How Candidates & Recruiters interact
              </h3>
            </div>
            <Link
              to="/jobs"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              View Available Openings
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-indigo-400 font-bold text-xs uppercase">Step 01</div>
              <h4 className="text-sm font-semibold text-white">Upload & Extract</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Candidate uploads PDF resume. Python PyMuPDF parses skills, past companies, and degree
                into structured MongoDB profiles.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-indigo-400 font-bold text-xs uppercase">Step 02</div>
              <h4 className="text-sm font-semibold text-white">Apply & Score</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Candidate applies with 1-click. Backend compares job requirements to candidate profile
                and generates transparent match score.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-indigo-400 font-bold text-xs uppercase">Step 03</div>
              <h4 className="text-sm font-semibold text-white">Review & Interview</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recruiter reviews applicants ranked by match score, views in-browser PDF, updates
                status, and books interview calendar.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

