import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: `${API_BASE}/api`,
});

client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const api = {
  // Auth
  signup: async (data: any) => {
    const res = await client.post("/auth/signup", data);
    if (res.data.access_token && typeof window !== "undefined") {
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  login: async (data: any) => {
    const res = await client.post("/auth/login", data);
    if (res.data.access_token && typeof window !== "undefined") {
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  getMe: async () => {
    const res = await client.get("/auth/me");
    return res.data;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  },

  // Dashboard
  getDashboardSummary: async () => {
    const res = await client.get("/dashboard");
    return res.data;
  },

  // Profile
  updateProfile: async (data: any) => {
    const res = await client.put("/profile", data);
    return res.data;
  },

  // Fresher Module
  analyzeFresher: async (formData: FormData) => {
    const res = await client.post("/fresher/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  askFresherRAG: async (analysisId: number, query: string) => {
    const res = await client.post("/fresher/ask", {
      analysis_id: analysisId,
      query,
    });
    return res.data;
  },

  generateInterviewQuestions: async (analysisId?: number, targetRole?: string) => {
    const res = await client.post("/fresher/interview", {
      analysis_id: analysisId,
      target_role: targetRole,
    });
    return res.data;
  },

  // Experienced Module
  analyzeExperienced: async (data: any) => {
    const res = await client.post("/experienced/analyze", data);
    return res.data;
  },

  getIndustryTrends: async () => {
    const res = await client.get("/experienced/trends");
    return res.data;
  },

  // Researcher Module
  uploadResearchPaper: async (formData: FormData) => {
    const res = await client.post("/research/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  askResearchRAG: async (paperId: number, query: string) => {
    const res = await client.post("/research/ask", {
      paper_id: paperId,
      query,
    });
    return res.data;
  },

  listResearchPapers: async () => {
    const res = await client.get("/research/papers");
    return res.data;
  },

  getResearchPaper: async (paperId: number) => {
    const res = await client.get(`/research/papers/${paperId}`);
    return res.data;
  },

  // Learning Plan
  getLearningPlan: async () => {
    const res = await client.get("/learning/plan");
    return res.data;
  },

  updateLearningTask: async (taskId: number, status: string) => {
    const res = await client.patch(`/learning/tasks/${taskId}`, { status });
    return res.data;
  },

  // Notifications
  getNotifications: async () => {
    const res = await client.get("/notifications");
    return res.data;
  },

  markNotificationRead: async (id: number) => {
    const res = await client.patch(`/notifications/${id}/read`);
    return res.data;
  },

  markAllNotificationsRead: async () => {
    const res = await client.post("/notifications/read-all");
    return res.data;
  },

  // Progress Tracker
  getProgressStats: async () => {
    const res = await client.get("/progress");
    return res.data;
  },
};
