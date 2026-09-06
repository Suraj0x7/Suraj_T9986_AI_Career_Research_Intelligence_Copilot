import re
import logging
from typing import Dict, Any, List
from pypdf import PdfReader

logger = logging.getLogger(__name__)

SECTION_HEADERS = {
    "education": [r"education", r"academic background", r"qualifications", r"degrees"],
    "experience": [r"experience", r"work experience", r"employment", r"professional experience", r"internships"],
    "skills": [r"skills", r"technical skills", r"technologies", r"competencies", r"core competencies", r"tools"],
    "projects": [r"projects", r"academic projects", r"key projects", r"personal projects"],
    "certifications": [r"certifications", r"certificates", r"licenses", r"courses", r"accreditations"],
}


class ResumeParser:
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> str:
        """Extracts complete text from a PDF file using pypdf."""
        try:
            reader = PdfReader(file_path)
            extracted_text = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    extracted_text.append(text)
            
            full_text = "\n".join(extracted_text)
            # Normalize whitespace
            full_text = re.sub(r"[ \t]+", " ", full_text)
            full_text = re.sub(r"\n\s*\n+", "\n\n", full_text)
            return full_text.strip()
        except Exception as e:
            logger.error("Error extracting text from PDF (%s): %s", file_path, e)
            raise ValueError(f"Could not parse PDF: {str(e)}")

    @classmethod
    def parse_sections(cls, text: str) -> Dict[str, Any]:
        """Identifies standard resume sections from the raw text."""
        sections: Dict[str, str] = {
            "education": "",
            "experience": "",
            "skills": "",
            "projects": "",
            "certifications": "",
            "general": ""
        }

        lines = text.split("\n")
        current_section = "general"
        section_buffers: Dict[str, List[str]] = {k: [] for k in sections.keys()}

        for line in lines:
            trimmed = line.strip()
            if not trimmed:
                continue

            # Check if line matches a known section header
            matched_header = False
            for sec_name, patterns in SECTION_HEADERS.items():
                for pat in patterns:
                    # Match headers like "SKILLS", "Technical Skills:", "--- Education ---"
                    regex = rf"^(?:[\#\*\-\s]*){pat}(?:[\:\-\s]*)$"
                    if re.match(regex, trimmed, re.IGNORECASE):
                        current_section = sec_name
                        matched_header = True
                        break
                if matched_header:
                    break

            if not matched_header:
                section_buffers[current_section].append(trimmed)

        for sec in sections.keys():
            sections[sec] = "\n".join(section_buffers[sec]).strip()

        # Extract candidate contact info if present
        email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
        phone_match = re.search(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text)

        first_line = lines[0].strip() if lines else "Candidate"
        name = first_line if len(first_line.split()) <= 4 and not "@" in first_line else "Candidate"

        return {
            "candidate_name": name,
            "email": email_match.group(0) if email_match else None,
            "phone": phone_match.group(0) if phone_match else None,
            "sections": sections
        }


resume_parser = ResumeParser()
