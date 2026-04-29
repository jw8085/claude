"use client";

import { useRef } from "react";
import { type BusinessPlanData } from "@/types";

interface Props {
  text: string;
  generating: boolean;
  isDone: boolean;
  onGenerate: () => void;
  onBack: () => void;
  onReset: () => void;
  data: BusinessPlanData;
}

const SECTIONS = [
  { key: "경영진 요약", icon: "📋", color: "#1e40af" },
  { key: "시장 분석", icon: "📊", color: "#0891b2" },
  { key: "제품 및 서비스", icon: "💡", color: "#7c3aed" },
  { key: "마케팅 전략", icon: "📣", color: "#be185d" },
  { key: "재무 계획", icon: "💰", color: "#065f46" },
  { key: "결론 및 비전", icon: "🎯", color: "#9a3412" },
];

function parseSections(text: string) {
  if (!text) return [];
  const result: { title: string; content: string; icon: string; color: string }[] = [];

  for (const section of SECTIONS) {
    const startPattern = `[${section.key}]`;
    const startIdx = text.indexOf(startPattern);
    if (startIdx === -1) continue;

    const contentStart = startIdx + startPattern.length;
    // Find the next section
    let contentEnd = text.length;
    for (const other of SECTIONS) {
      if (other.key === section.key) continue;
      const otherIdx = text.indexOf(`[${other.key}]`, contentStart);
      if (otherIdx !== -1 && otherIdx < contentEnd) {
        contentEnd = otherIdx;
      }
    }

    const content = text.slice(contentStart, contentEnd).trim();
    if (content) {
      result.push({
        title: section.key,
        content,
        icon: section.icon,
        color: section.color,
      });
    }
  }

  return result;
}

export default function GeneratedPlanView({
  text,
  generating,
  isDone,
  onGenerate,
  onBack,
  onReset,
  data,
}: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const sections = parseSections(text);
  const hasContent = text.length > 0;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    alert("사업계획서가 클립보드에 복사되었습니다.");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header className="gradient-bg no-print">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "white" }}>
            <span style={{ fontSize: 22 }}>📋</span>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>사업계획서 AI 작성기</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>{data.businessName || "사업계획서"} 생성 완료</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onBack}
              style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)", padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600 }}
            >
              ← 수정
            </button>
            <button
              onClick={onReset}
              style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)", padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600 }}
            >
              🔄 새로 작성
            </button>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 900, margin: "0 auto", width: "100%", padding: "24px 16px" }}>
        {/* Status Bar */}
        {generating && (
          <div className="no-print" style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <div className="spinner" style={{ width: 20, height: 20, border: "3px solid #bfdbfe", borderTopColor: "#2563eb", borderRadius: "50%", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1d4ed8" }}>AI가 사업계획서를 작성 중입니다...</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Claude Opus 4.7이 전문적인 내용을 생성하고 있습니다. 잠시만 기다려 주세요.</div>
            </div>
          </div>
        )}

        {isDone && (
          <div className="no-print fade-up" style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>사업계획서 작성 완료!</div>
                <div style={{ fontSize: 12, color: "#4ade80" }}>전문적인 사업계획서가 성공적으로 생성되었습니다.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-secondary" onClick={handleCopy} style={{ fontSize: 13, padding: "8px 16px" }}>
                📋 복사
              </button>
              <button className="btn-success" onClick={handlePrint} style={{ fontSize: 13, padding: "8px 16px" }}>
                🖨️ 인쇄/PDF
              </button>
              <button
                className="btn-primary"
                onClick={onGenerate}
                style={{ fontSize: 13, padding: "8px 16px" }}
              >
                🔄 재생성
              </button>
            </div>
          </div>
        )}

        {!hasContent && !generating && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a8a", marginBottom: 8 }}>사업계획서를 생성해 주세요</h3>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>AI가 입력하신 정보를 바탕으로 전문적인 사업계획서를 작성합니다.</p>
            <button className="btn-primary" onClick={onGenerate} style={{ fontSize: 15, padding: "12px 32px" }}>
              🚀 사업계획서 생성 시작
            </button>
          </div>
        )}

        {/* Document */}
        {hasContent && (
          <div ref={printRef}>
            {/* Document Header */}
            <div className="card" style={{ padding: "28px 32px", marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>사업계획서</div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1e3a8a", marginBottom: 8 }}>
                {data.businessName || "사업계획서"}
              </h1>
              <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                {data.industry && (
                  <span style={{ fontSize: 13, background: "#eff6ff", color: "#1d4ed8", padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>
                    {data.industry}
                  </span>
                )}
                {data.businessType && (
                  <span style={{ fontSize: 13, background: "#f0fdf4", color: "#166534", padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>
                    {data.businessType}
                  </span>
                )}
                {data.location && (
                  <span style={{ fontSize: 13, background: "#fef3c7", color: "#92400e", padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>
                    📍 {data.location}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 12 }}>
                작성일: {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>

            {/* Sections */}
            {sections.length > 0 ? (
              sections.map((section, i) => (
                <div
                  key={i}
                  className="card fade-up"
                  style={{ marginBottom: 14, overflow: "hidden" }}
                >
                  <div
                    style={{
                      padding: "14px 24px",
                      borderBottom: `3px solid ${section.color}`,
                      background: `${section.color}08`,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{section.icon}</span>
                    <h2 style={{ fontSize: 15, fontWeight: 800, color: section.color, margin: 0 }}>
                      {section.title}
                    </h2>
                  </div>
                  <div style={{ padding: "18px 24px" }}>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.9, whiteSpace: "pre-wrap", margin: 0 }}>
                      {section.content}
                      {generating && i === sections.length - 1 && (
                        <span className="cursor" />
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              // Raw text fallback when sections aren't parsed yet
              <div className="card" style={{ padding: "24px 28px" }}>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
                  {text}
                  {generating && <span className="cursor" />}
                </p>
              </div>
            )}

            {/* Footer */}
            {isDone && (
              <div style={{ textAlign: "center", padding: "16px", color: "#94a3b8", fontSize: 12 }}>
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
                  본 사업계획서는 Claude AI에 의해 자동 생성되었습니다. 실제 제출 전 전문가 검토를 권장합니다.
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
