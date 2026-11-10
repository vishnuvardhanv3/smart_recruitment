#!/usr/bin/env python3
"""
Generate sample PDF resumes for realistic ATS testing using PyMuPDF.
"""

import os
import sys

try:
    import pymupdf as fitz
except ImportError:
    import fitz

def create_resume_pdf(output_path, name, email, phone, title, summary, skills, experience_list, education_list):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = fitz.open()
    page = doc.new_page(width=595, height=842) # A4 format

    y = 50
    # Header - Name
    page.insert_text((50, y), name, fontsize=20, fontname="helv", color=(0.1, 0.15, 0.3))
    y += 24
    # Title
    page.insert_text((50, y), title, fontsize=12, fontname="helv", color=(0.35, 0.4, 0.5))
    y += 20
    # Contact
    contact_line = f"Email: {email}   |   Phone: {phone}   |   Location: San Francisco, CA"
    page.insert_text((50, y), contact_line, fontsize=10, fontname="helv", color=(0.4, 0.4, 0.4))
    y += 15

    # Divider line
    page.draw_line(fitz.Point(50, y), fitz.Point(545, y), color=(0.7, 0.7, 0.7), width=1)
    y += 25

    # Professional Summary
    page.insert_text((50, y), "PROFESSIONAL SUMMARY", fontsize=12, fontname="helv", color=(0.1, 0.15, 0.3))
    y += 18
    # Wrap summary into lines
    words = summary.split()
    line = ""
    for w in words:
        if len(line + " " + w) < 95:
            line = (line + " " + w).strip()
        else:
            page.insert_text((50, y), line, fontsize=10, fontname="helv", color=(0.2, 0.2, 0.2))
            y += 14
            line = w
    if line:
        page.insert_text((50, y), line, fontsize=10, fontname="helv", color=(0.2, 0.2, 0.2))
        y += 22

    # Technical Skills
    page.insert_text((50, y), "TECHNICAL SKILLS & EXPERTISE", fontsize=12, fontname="helv", color=(0.1, 0.15, 0.3))
    y += 18
    skills_line = ", ".join(skills)
    page.insert_text((50, y), f"Skills: {skills_line}", fontsize=10, fontname="helv", color=(0.2, 0.2, 0.2))
    y += 25

    # Work Experience
    page.insert_text((50, y), "PROFESSIONAL EXPERIENCE (5+ years of experience)", fontsize=12, fontname="helv", color=(0.1, 0.15, 0.3))
    y += 20

    for exp in experience_list:
        role_company = f"{exp['title']} - {exp['company']}"
        date_str = f"{exp['startDate']} - {exp['endDate']}"
        page.insert_text((50, y), role_company, fontsize=11, fontname="helv", color=(0.15, 0.2, 0.35))
        page.insert_text((420, y), date_str, fontsize=9, fontname="helv", color=(0.5, 0.5, 0.5))
        y += 15
        
        for bullet in exp.get('bullets', []):
            page.insert_text((60, y), f"•  {bullet}", fontsize=9.5, fontname="helv", color=(0.25, 0.25, 0.25))
            y += 14
        y += 8

    # Education
    page.insert_text((50, y), "EDUCATION", fontsize=12, fontname="helv", color=(0.1, 0.15, 0.3))
    y += 18
    for edu in education_list:
        edu_str = f"{edu['degree']} | {edu['institution']} ({edu.get('endYear', '2022')})"
        page.insert_text((50, y), edu_str, fontsize=10, fontname="helv", color=(0.2, 0.2, 0.2))
        y += 15

    doc.save(output_path)
    doc.close()
    print(f"Created sample PDF at: {output_path}")

if __name__ == "__main__":
    dest = sys.argv[1] if len(sys.argv) > 1 else "uploads/resumes/sample_alex_morgan_resume.pdf"
    create_resume_pdf(
        output_path=dest,
        name="Alex Morgan",
        email="alex.morgan@example.com",
        phone="+1 (555) 349-8201",
        title="Senior Full-Stack Software Engineer",
        summary="Results-driven Senior Full-Stack Engineer with 5+ years of experience architecting scalable web applications, RESTful microservices, and modern user interfaces. Proficient in React, Node.js, Express, MongoDB, Docker, and AWS cloud infrastructures.",
        skills=["JavaScript", "TypeScript", "React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Docker", "AWS", "Git", "REST API", "GraphQL", "Jest", "Microservices"],
        experience_list=[
            {
                "title": "Senior Full-Stack Developer",
                "company": "Apex Cloud Systems",
                "startDate": "2022",
                "endDate": "Present",
                "bullets": [
                    "Engineered cloud-native web dashboard in React & Node.js serving 120,000+ monthly active enterprise users.",
                    "Improved API response latency by 45% through MongoDB aggregation indexing and Redis caching.",
                    "Led a cross-functional squad of 6 engineers practicing Agile and CI/CD automated deployments."
                ]
            },
            {
                "title": "Full-Stack Software Engineer",
                "company": "Horizon Tech Labs",
                "startDate": "2019",
                "endDate": "2022",
                "bullets": [
                    "Developed high-throughput RESTful microservices with Node.js, Express, and Docker.",
                    "Collaborated with product designers to implement responsive UI components using React and Tailwind CSS."
                ]
            }
        ],
        education_list=[
            {
                "degree": "Bachelor of Science in Computer Science",
                "institution": "University of California, Berkeley",
                "endYear": "2019"
            }
        ]
    )

