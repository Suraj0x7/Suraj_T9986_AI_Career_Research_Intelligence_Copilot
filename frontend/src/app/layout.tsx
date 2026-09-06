import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Career & Research Copilot | SaaS Intelligence Platform",
  description: "AI-powered career guidance, personalized upskilling, and evidence-grounded research intelligence.",
  keywords: ["AI Career Copilot", "Resume Intelligence", "ATS Score", "Research Copilot", "RAG", "Career Roadmap"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080c16] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
