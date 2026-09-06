import re
from typing import Dict, List, Any, Set
from app.services.skill_extractor import skill_extractor, SKILL_TAXONOMY


class MatchingEngine:
    @classmethod
    def compare_skills(cls, resume_skills: List[str], jd_skills: List[str]) -> Dict[str, Any]:
        """Compares resume skills against job description skills."""
        resume_set: Set[str] = set(resume_skills)
        jd_set: Set[str] = set(jd_skills) if jd_skills else set(["Python", "SQL", "Docker", "FastAPI"])

        matched = sorted(list(resume_set.intersection(jd_set)))
        missing = sorted(list(jd_set.difference(resume_set)))
        strong = [s for s in matched if skill_extractor.get_category_for_skill(s) in ["Programming", "AI/ML", "Frameworks"]]

        # Calculate score
        total_req = max(len(jd_set), 1)
        match_score = round((len(matched) / total_req) * 100, 1)

        # Priority missing skills (DevOps, Cloud, Core Frameworks ranked higher)
        priority_categories = ["DevOps", "Cloud", "Frameworks", "AI/ML"]
        priority = sorted(
            missing,
            key=lambda s: (0 if skill_extractor.get_category_for_skill(s) in priority_categories else 1)
        )[:5]

        # Category-wise breakdown
        categories = ["Programming", "Cloud", "Database", "AI/ML", "Frameworks", "DevOps"]
        category_scores: Dict[str, Dict[str, Any]] = {}

        for cat in categories:
            cat_jd = [s for s in jd_set if skill_extractor.get_category_for_skill(s) == cat]
            cat_matched = [s for s in matched if skill_extractor.get_category_for_skill(s) == cat]
            cat_missing = [s for s in missing if skill_extractor.get_category_for_skill(s) == cat]
            total_cat = len(cat_jd)
            pct = round((len(cat_matched) / max(total_cat, 1)) * 100, 1) if total_cat > 0 else (100.0 if len(cat_matched) > 0 else 0.0)

            category_scores[cat] = {
                "total": total_cat,
                "matched_count": len(cat_matched),
                "missing_count": len(cat_missing),
                "matched": cat_matched,
                "missing": cat_missing,
                "percentage": pct
            }

        return {
            "match_score": match_score,
            "matched_skills": matched,
            "missing_skills": missing,
            "strong_skills": strong,
            "priority_skills": priority,
            "category_scores": category_scores
        }

    @classmethod
    def calculate_ats_score(
        cls,
        resume_text: str,
        sections: Dict[str, str],
        resume_skills: List[str],
        jd_skills: List[str]
    ) -> Dict[str, Any]:
        """Calculates comprehensive ATS compatibility score with targeted recommendations."""
        score = 0.0
        good_sections: List[str] = []
        weak_sections: List[str] = []
        recommendations: List[str] = []

        # 1. Section Presence (25 points max)
        section_weights = {
            "experience": 8,
            "skills": 7,
            "projects": 5,
            "education": 3,
            "certifications": 2
        }
        for sec_name, weight in section_weights.items():
            content = sections.get(sec_name, "").strip()
            if content and len(content) > 30:
                score += weight
                good_sections.append(sec_name.capitalize())
            else:
                weak_sections.append(sec_name.capitalize())
                recommendations.append(f"Expand the '{sec_name.capitalize()}' section with clear, detailed bullet points.")

        # 2. Skill Match Alignment (35 points max)
        jd_set = set(jd_skills) if jd_skills else set(["Python", "SQL", "Docker", "FastAPI"])
        resume_set = set(resume_skills)
        matched = resume_set.intersection(jd_set)
        skill_ratio = len(matched) / max(len(jd_set), 1)
        skill_points = round(skill_ratio * 35, 1)
        score += skill_points

        missing_keywords = sorted(list(jd_set.difference(resume_set)))
        if missing_keywords:
            sample_missing = ", ".join(missing_keywords[:3])
            recommendations.append(f"Incorporate target keywords ({sample_missing}) where you have hands-on experience.")

        # 3. Quantifiable Results & Metrics (20 points max)
        # Look for numbers, percentages, dollar signs, metrics
        metrics_matches = re.findall(r"\b(?:\d+[\.,]?\d*%|\$\d+[\.,]?\d*|\d+\+?\s*(?:users|ms|queries|requests|x|fold))\b", resume_text, re.IGNORECASE)
        action_verbs = re.findall(r"\b(implemented|architected|optimized|deployed|developed|engineered|designed|reduced|increased|scaled)\b", resume_text, re.IGNORECASE)

        if len(metrics_matches) >= 4:
            score += 12
            good_sections.append("Quantifiable Outcomes")
        elif len(metrics_matches) >= 2:
            score += 7
            recommendations.append("Quantify your project outcomes (e.g. 'Improved inference throughput by 30%').")
        else:
            score += 3
            weak_sections.append("Measurable Impact")
            recommendations.append("Add measurable metrics (percentages, speedups, request volumes) to demonstrate concrete value.")

        if len(action_verbs) >= 5:
            score += 8
        else:
            score += 4
            recommendations.append("Begin project bullet points with strong action verbs (e.g. Architected, Engineered, Optimized).")

        # 4. Contact & Formatting Quality (10 points max)
        has_email = bool(re.search(r"[\w\.-]+@[\w\.-]+\.\w+", resume_text))
        has_phone = bool(re.search(r"\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}", resume_text))
        if has_email and has_phone:
            score += 10
            good_sections.append("Contact Info")
        elif has_email:
            score += 6
        else:
            weak_sections.append("Contact Info")
            recommendations.append("Ensure your email and phone number are clearly visible at the top of your resume.")

        # 5. Length & Structure (10 points max)
        word_count = len(resume_text.split())
        if 250 <= word_count <= 950:
            score += 10
            good_sections.append("Concise Length")
        elif word_count > 950:
            score += 6
            recommendations.append("Consider trimming your resume content to 1-2 focused pages for higher recruiter readability.")
        else:
            score += 4
            recommendations.append("Resume is quite brief. Add more technical depth to your project descriptions.")

        final_ats_score = round(min(max(score, 45.0), 96.0), 1)

        # Generate next best action
        if missing_keywords:
            top_kw = missing_keywords[0]
            next_best_action = f"Complete {top_kw} fundamentals and containerize or integrate it into one of your existing projects."
        else:
            next_best_action = "Review system design questions and run an AI interview simulation for your target role."

        return {
            "ats_score": final_ats_score,
            "good_sections": good_sections,
            "weak_sections": weak_sections,
            "missing_keywords": missing_keywords[:8],
            "recommendations": recommendations[:5],
            "next_best_action": next_best_action
        }


matching_engine = MatchingEngine()
