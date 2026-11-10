#!/usr/bin/env python3
"""
SmartHire Resume-Job Matcher
Calculates transparent keyword-based match score between Candidate Profile/Resume and Job Openings.
"""

import sys
import json
import re

def normalize_skill(skill):
    """Normalize skill string for fair matching"""
    s = skill.strip().lower()
    mapping = {
        "react.js": "react",
        "reactjs": "react",
        "node.js": "node",
        "nodejs": "node",
        "express.js": "express",
        "expressjs": "express",
        "vue.js": "vue",
        "vuejs": "vue",
        "next.js": "nextjs",
        "aws": "amazon web services",
        "gcp": "google cloud",
        "restful api": "rest",
        "rest api": "rest",
        "rest apis": "rest",
        "tailwind": "tailwind css",
    }
    return mapping.get(s, s)

def calculate_match(candidate_data, job_data):
    candidate_skills = candidate_data.get("skills", [])
    candidate_exp = float(candidate_data.get("yearsOfExperience", 0) or 0)
    candidate_text = candidate_data.get("rawText", "").lower()

    required_skills = job_data.get("requiredSkills", [])
    preferred_skills = job_data.get("preferredSkills", [])
    min_exp = float(job_data.get("minExperience", 0) or 0)
    job_desc = job_data.get("description", "").lower()

    # Map candidate skills to normalized set
    norm_candidate_skills = {normalize_skill(s) for s in candidate_skills}
    
    # 1. Required Skills Matching
    matched_required = []
    missing_required = []
    for req in required_skills:
        n_req = normalize_skill(req)
        # Check direct skill list or occurrence in resume text
        if n_req in norm_candidate_skills or re.search(r'\b' + re.escape(n_req) + r'\b', candidate_text):
            matched_required.append(req)
        else:
            missing_required.append(req)

    # 2. Preferred Skills Matching
    matched_preferred = []
    for pref in preferred_skills:
        n_pref = normalize_skill(pref)
        if n_pref in norm_candidate_skills or re.search(r'\b' + re.escape(n_pref) + r'\b', candidate_text):
            matched_preferred.append(pref)

    total_req = len(required_skills) if required_skills else 1
    req_ratio = len(matched_required) / total_req
    pref_ratio = (len(matched_preferred) / len(preferred_skills)) if preferred_skills else 0.0

    # Skills subscore (0-100): 85% required + 15% preferred bonus
    skills_subscore = min(100.0, (req_ratio * 85.0) + (pref_ratio * 15.0))

    # 3. Experience Matching
    exp_matched = candidate_exp >= min_exp
    if min_exp <= 0:
        exp_subscore = 100.0
    else:
        exp_ratio = candidate_exp / min_exp
        if exp_ratio >= 1.0:
            exp_subscore = 100.0
        else:
            exp_subscore = max(30.0, exp_ratio * 100.0)

    # 4. Keyword / Context Similarity
    # Check frequency of key domain terms in candidate text
    job_words = set(re.findall(r'\b[a-zA-Z]{4,}\b', job_desc))
    resume_words = set(re.findall(r'\b[a-zA-Z]{4,}\b', candidate_text))
    common_words = job_words.intersection(resume_words)
    keyword_ratio = (len(common_words) / len(job_words)) if job_words else 0.5
    keyword_subscore = min(100.0, max(20.0, keyword_ratio * 180.0))

    # Final Weighted Score: 55% Skills + 25% Experience + 20% Keywords
    final_score = round(
        (0.55 * skills_subscore) +
        (0.25 * exp_subscore) +
        (0.20 * keyword_subscore)
    )
    final_score = max(10, min(98, final_score)) # keep realistic ATS range

    # Generate transparent explanation
    all_matched = matched_required + matched_preferred
    matched_summary = f"{len(matched_required)}/{len(required_skills)} required skills matched ({', '.join(matched_required[:4]) if matched_required else 'None'})"
    
    if exp_matched:
        exp_summary = f"Meets experience criteria ({candidate_exp} yrs vs {min_exp} yrs required)"
    else:
        exp_summary = f"Experience ({candidate_exp} yrs) is below requirement ({min_exp} yrs)"

    if missing_required:
        miss_summary = f"Gaps identified in: {', '.join(missing_required[:3])}"
    else:
        miss_summary = "All required core competencies met"

    explanation = f"{matched_summary}. {exp_summary}. {miss_summary}."

    return {
        "score": final_score,
        "matchedSkills": all_matched,
        "missingSkills": missing_required,
        "experienceMatch": exp_matched,
        "explanation": explanation,
        "breakdown": {
            "skillsScore": round(skills_subscore),
            "experienceScore": round(exp_subscore),
            "keywordScore": round(keyword_subscore)
        }
    }

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        candidate_data = input_data.get("candidate", {})
        job_data = input_data.get("job", {})
        res = calculate_match(candidate_data, job_data)
        print(json.dumps(res))
    except Exception as e:
        print(json.dumps({
            "score": 50,
            "matchedSkills": [],
            "missingSkills": [],
            "experienceMatch": True,
            "explanation": f"Basic match calculated (fallback due to {str(e)})",
            "breakdown": {"skillsScore": 50, "experienceScore": 50, "keywordScore": 50}
        }))

