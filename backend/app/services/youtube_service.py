import urllib.parse
import logging
from typing import List, Dict
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

CURATED_TECH_RESOURCES: Dict[str, List[Dict[str, str]]] = {
    "Docker": [
        {"title": "Docker Tutorial for Beginners [Full Course]", "channel": "freeCodeCamp.org", "url": "https://www.youtube.com/watch?v=fqMOX6JJhGo"},
        {"title": "Docker in 100 Seconds", "channel": "Fireship", "url": "https://www.youtube.com/watch?v=Gjnup-PuquQ"},
        {"title": "Docker & Kubernetes Complete Guide", "channel": "TechWorld with Nana", "url": "https://www.youtube.com/watch?v=3c-iBn73dDE"}
    ],
    "Kubernetes": [
        {"title": "Kubernetes Tutorial for Beginners [FULL COURSE in 4 Hours]", "channel": "TechWorld with Nana", "url": "https://www.youtube.com/watch?v=X48VuDVv0do"},
        {"title": "Kubernetes in 100 Seconds", "channel": "Fireship", "url": "https://www.youtube.com/watch?v=PivpCKEiQOQ"}
    ],
    "FastAPI": [
        {"title": "FastAPI Full Course 2024 - Beginner to Pro", "channel": "freeCodeCamp.org", "url": "https://www.youtube.com/watch?v=0sOvCWFmrtA"},
        {"title": "FastAPI in 100 Seconds", "channel": "Fireship", "url": "https://www.youtube.com/watch?v=tLKKmouUAMS"}
    ],
    "LangChain": [
        {"title": "LangChain Crash Course for Beginners", "channel": "freeCodeCamp.org", "url": "https://www.youtube.com/watch?v=lG7Uxts9SXs"},
        {"title": "LangChain in 100 Seconds", "channel": "Fireship", "url": "https://www.youtube.com/watch?v=aywZrzNaKjs"}
    ],
    "RAG": [
        {"title": "Retrieval-Augmented Generation (RAG) Explained", "channel": "IBM Technology", "url": "https://www.youtube.com/watch?v=T-D1OfcDW1M"},
        {"title": "Build a RAG App from Scratch", "channel": "freeCodeCamp.org", "url": "https://www.youtube.com/watch?v=2TJxpyO3ei4"}
    ],
    "AWS": [
        {"title": "AWS Certified Cloud Practitioner Training 2024", "channel": "freeCodeCamp.org", "url": "https://www.youtube.com/watch?v=SOTamWNgDKc"},
        {"title": "AWS Basics for Beginners", "channel": "Simplilearn", "url": "https://www.youtube.com/watch?v=k1RI5locZE4"}
    ],
    "PostgreSQL": [
        {"title": "PostgreSQL Full Course - 4 Hours", "channel": "freeCodeCamp.org", "url": "https://www.youtube.com/watch?v=qw--VYLpxG4"},
        {"title": "Learn PostgreSQL Tutorial", "channel": "Amigoscode", "url": "https://www.youtube.com/watch?v=zw4s3EY9ths"}
    ],
}


class YouTubeService:
    @classmethod
    async def get_tutorials_for_skill(cls, skill: str) -> List[Dict[str, str]]:
        """Retrieves top 3 tutorials for a skill using API or verified curated fallbacks."""
        if settings.YOUTUBE_API_KEY and settings.YOUTUBE_API_KEY.strip() and settings.YOUTUBE_API_KEY != "your_youtube_api_key_optional":
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    query = f"{skill} tutorial full course beginner"
                    resp = await client.get(
                        "https://www.googleapis.com/youtube/v3/search",
                        params={
                            "part": "snippet",
                            "q": query,
                            "type": "video",
                            "maxResults": 3,
                            "key": settings.YOUTUBE_API_KEY.strip()
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        videos = []
                        for item in data.get("items", []):
                            video_id = item["id"].get("videoId")
                            snippet = item.get("snippet", {})
                            if video_id:
                                videos.append({
                                    "title": snippet.get("title", f"{skill} Tutorial"),
                                    "channel": snippet.get("channelTitle", "YouTube Creator"),
                                    "url": f"https://www.youtube.com/watch?v={video_id}"
                                })
                        if videos:
                            return videos
            except Exception as e:
                logger.warning("YouTube API fetch failed for %s: %s. Using curated fallback.", skill, e)

        # Fallback to curated resources or search query URL
        if skill in CURATED_TECH_RESOURCES:
            return CURATED_TECH_RESOURCES[skill]

        encoded = urllib.parse.quote_plus(f"{skill} tutorial full course")
        return [
            {
                "title": f"Complete {skill} Tutorial & Roadmap",
                "channel": "Tech Community / Curated Learning",
                "url": f"https://www.youtube.com/results?search_query={encoded}"
            },
            {
                "title": f"{skill} Crash Course for Developers",
                "channel": "Official Resources",
                "url": f"https://www.youtube.com/results?search_query={encoded}+crash+course"
            }
        ]


youtube_service = YouTubeService()
