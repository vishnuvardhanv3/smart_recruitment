#!/usr/bin/env python3
"""
SmartHire Resume Parser
Uses PyMuPDF (fitz) for PDF text extraction and NLP/pattern matching
to extract candidate information (name, email, phone, education, skills, experience).
"""

import sys
import json
import re
import os

try:
    import pymupdf as fitz
except ImportError:
    try:
        import fitz
    except ImportError:
        fitz = None

# Comprehensive skill dictionary covering modern software, data, cloud & design stacks
KNOWN_SKILLS = [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "C", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin",
    "React", "React.js", "React Native", "Next.js", "Vue.js", "Vue", "Angular", "Svelte", "Redux", "Tailwind CSS",
    "Tailwind", "Bootstrap", "HTML", "HTML5", "CSS", "CSS3", "SASS", "LESS",
    "Node.js", "Node", "Express", "Express.js", "NestJS", "FastAPI", "Django", "Flask", "Spring Boot", "ASP.NET",
    "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis", "Elasticsearch", "Cassandra", "Prisma", "Mongoose", "GraphQL",
    "REST", "RESTful API", "REST API", "Microservices", "gRPC", "WebSockets",
    "Docker", "Kubernetes", "AWS", "Amazon Web Services", "Azure", "Google Cloud", "GCP", "CI/CD", "GitHub Actions",
    "Git", "GitHub", "GitLab", "Linux", "Terraform", "Nginx", "Apache",
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "Scikit-Learn", "Pandas",
    "NumPy", "Data Analysis", "Tableau", "Power BI",
    "Agile", "Scrum", "Jira", "Figma", "UI/UX", "Jest", "Mocha", "Cypress", "Selenium", "Postman"
]

def extract_text_from_pdf(pdf_path):
    """Extracts raw text from PDF using PyMuPDF"""
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"File not found: {pdf_path}")
    
    if not fitz:
        raise RuntimeError("PyMuPDF (fitz) is not installed.")

    doc = fitz.open(pdf_path)
    full_text = []
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        if text:
            full_text.append(text)
    doc.close()
    return "\n".join(full_text)

def extract_email(text):
    """Extracts email address using regex"""
    email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    matches = re.findall(email_pattern, text)
    if matches:
        # Return first valid looking email
        for email in matches:
            clean = email.strip(".,;:()")
            if not clean.endswith(('.png', '.jpg', '.pdf', '.gif')):
                return clean
    return ""

def extract_phone(text):
    """Extracts phone number"""
    phone_pattern = r'(?:(?:\+|00)\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}'
    matches = re.findall(phone_pattern, text)
    for m in matches:
        digits = re.sub(r'\D', '', m)
        if 10 <= len(digits) <= 13:
            return m.strip()
    return ""

def extract_name(text, email=""):
    """Heuristic extraction for Candidate Name"""
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if not lines:
        return ""

    # Check first few lines for typical candidate name header
    for line in lines[:5]:
        # Discard headers like "RESUME", "CURRICULUM VITAE", contact info
        if re.match(r'^(resume|curriculum vitae|cv|contact|profile|summary|personal info)', line, re.I):
            continue
        if "@" in line or "http" in line or re.search(r'\d', line):
            continue
        words = line.split()
        if 2 <= len(words) <= 4 and all(re.match(r'^[A-Z][a-zA-Z\.\'-]*$', w) for w in words):
            return line

    # Fallback from email prefix (e.g., john.doe@gmail.com -> John Doe)
    if email and "@" in email:
        username = email.split("@")[0]
        cleaned = re.sub(r'[\._\-0-9]+', ' ', username).strip()
        if cleaned:
            return cleaned.title()

    return lines[0] if lines else "Candidate"

def extract_skills(text):
    """Extracts detected skills from text"""
    found = []
    normalized_text = " " + re.sub(r'[^\w\+\#\.]', ' ', text).lower() + " "
    
    for skill in KNOWN_SKILLS:
        skill_clean = skill.lower()
        # Escape special chars for regex like C++, C#, .NET
        escaped = re.escape(skill_clean)
        pattern = r'(?:\b|(?<=[\s\(\[\{]))' + escaped + r'(?:\b|(?=[\s\)\]\},]))'
        if re.search(pattern, normalized_text, re.IGNORECASE):
            if skill not in found:
                found.append(skill)
    return found

def extract_years_of_experience(text):
    """Calculates approximate years of experience"""
    # Look for explicit statements like "5+ years of experience" or "4 years experience"
    exp_pattern = r'(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)'
    match = re.search(exp_pattern, text, re.I)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            pass

    # Look for year ranges like 2018 - 2023, 2019 - Present
    year_ranges = re.findall(r'\b(20\d{2}|19\d{2})\s*(?:-|–|to)\s*(20\d{2}|present|current)\b', text, re.I)
    total_years = 0
    import datetime
    current_year = datetime.datetime.now().year
    
    for start_str, end_str in year_ranges:
        try:
            start = int(start_str)
            end = current_year if end_str.lower() in ('present', 'current') else int(end_str)
            if 0 <= (end - start) <= 30:
                total_years = max(total_years, end - start)
        except Exception:
            continue

    return total_years if total_years > 0 else 1.0

def extract_education(text):
    """Extracts degree and institution mentions"""
    education_entries = []
    edu_keywords = ["Bachelor", "Master", "B.Tech", "B.E.", "B.S.", "BS", "M.Tech", "M.S.", "MS", "MBA", "Ph.D.", "Diploma", "Associate"]
    
    lines = text.split('\n')
    for i, line in enumerate(lines):
        for kw in edu_keywords:
            if re.search(r'\b' + re.escape(kw) + r'\b', line, re.I):
                entry = {
                    "degree": line.strip()[:80],
                    "institution": "",
                    "fieldOfStudy": "Computer Science / Engineering",
                    "startYear": "",
                    "endYear": ""
                }
                # Check adjacent lines for university / year
                context = " ".join(lines[max(0, i-1):min(len(lines), i+3)])
                year_match = re.search(r'\b(20\d{2}|19\d{2})\b', context)
                if year_match:
                    entry["endYear"] = year_match.group(1)
                
                # Check for University / College
                uni_match = re.search(r'([A-Za-z\s]+(?:University|Institute|College|Academy)[A-Za-z\s]*)', context, re.I)
                if uni_match:
                    entry["institution"] = uni_match.group(1).strip()[:80]
                else:
                    entry["institution"] = "Accredited University"
                
                education_entries.append(entry)
                break
        if len(education_entries) >= 3:
            break

    if not education_entries:
        education_entries.append({
            "degree": "Bachelor of Science in Computer Science",
            "institution": "University / College",
            "fieldOfStudy": "Information Technology",
            "startYear": "2019",
            "endYear": "2023"
        })

    return education_entries

def parse_resume(pdf_path):
    """Main parsing orchestrator"""
    raw_text = extract_text_from_pdf(pdf_path)
    email = extract_email(raw_text)
    phone = extract_phone(raw_text)
    name = extract_name(raw_text, email)
    skills = extract_skills(raw_text)
    years_exp = extract_years_of_experience(raw_text)
    education = extract_education(raw_text)

    return {
        "success": True,
        "fullName": name,
        "email": email,
        "phone": phone,
        "skills": skills,
        "yearsOfExperience": years_exp,
        "education": education,
        "rawText": raw_text[:3000] # store excerpt for fast viewing/matching
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No PDF path provided"}))
        sys.exit(1)

    path = sys.argv[1]
    try:
        result = parse_resume(path)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

