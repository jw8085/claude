"use client";

import { useState, useRef } from "react";
import { type BusinessPlanData, INDUSTRIES, BUSINESS_TYPES } from "@/types";
import GeneratedPlanView from "@/components/GeneratedPlanView";

const TOTAL_STEPS = 5;

const INITIAL_DATA: BusinessPlanData = {
  businessName: "",
  industry: "",
  businessType: "",
  overview: "",
  founders: "",
  location: "",
  targetMarket: "",
  marketSize: "",
  competitors: "",
  competitiveAdvantage: "",
  productService: "",
  uniqueValue: "",
  keyFeatures: "",
  pricingStrategy: "",
  marketingChannels: "",
  customerAcquisition: "",
  salesStrategy: "",
  partnerships: "",
  initialInvestment: "",
  revenueModel: "",
  monthlyRevenue: "",
  breakEvenPoint: "",
};

const STEP_INFO = [
  { label: "기본 정보", icon: "🏢" },
  { label: "시장 분석", icon: "📊" },
  { label: "제품/서비스", icon: "💡" },
  { label: "마케팅", icon: "📣" },
  { label: "재무 계획", icon: "💰" },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BusinessPlanData>(INITIAL_DATA);
  const [generating, setGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const update = (field: keyof BusinessPlanData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const canProceed = (): boolean => {
    if (step === 0)
      return !!(
        data.businessName &&
        data.industry &&
        data.businessType &&
        data.overview
      );
    if (step === 1) return !!(data.targetMarket && data.competitiveAdvantage);
    if (step === 2) return !!(data.productService && data.uniqueValue);
    if (step === 3) return !!(data.marketingChannels && data.customerAcquisition);
    if (step === 4)
      return !!(data.initialInvestment && data.revenueModel && data.monthlyRevenue);
    return true;
  };

  const generate = async () => {
    setGenerating(true);
    setGeneratedText("");
    setIsDone(false);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("생성 실패");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setGeneratedText((prev) => prev + decoder.decode(value, { stream: true }));
      }
      setIsDone(true);
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== "AbortError") {
        setGeneratedText("오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } finally {
      setGenerating(false);
    }
  };

  const reset = () => {
    setStep(0);
    setData(INITIAL_DATA);
    setGeneratedText("");
    setIsDone(false);
  };

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  if (step >= TOTAL_STEPS) {
    return (
      <GeneratedPlanView
        text={generatedText}
        generating={generating}
        isDone={isDone}
        onGenerate={generate}
        onBack={() => setStep(TOTAL_STEPS - 1)}
        onReset={reset}
        data={data}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header className="gradient-bg" style={{ padding: "0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "white" }}>
            <span style={{ fontSize: 24 }}>📋</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" }}>
                사업계획서 AI 작성기
              </div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>
                Claude AI가 전문적인 사업계획서를 작성해 드립니다
              </div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 860, margin: "0 auto", width: "100%", padding: "24px 16px" }}>
        {/* Step Indicator */}
        <div className="card" style={{ padding: "20px 24px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            {STEP_INFO.map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                <div
                  className="step-dot"
                  style={{
                    background:
                      i < step ? "#10b981" : i === step ? "#2563eb" : "#e2e8f0",
                    color: i <= step ? "white" : "#94a3b8",
                    fontSize: i < step ? 16 : 13,
                  }}
                >
                  {i < step ? "✓" : s.icon}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: i === step ? 700 : 500,
                    color: i === step ? "#2563eb" : i < step ? "#10b981" : "#94a3b8",
                    textAlign: "center",
                    lineHeight: 1.2,
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ textAlign: "right", fontSize: 12, color: "#64748b", marginTop: 6 }}>
            {step + 1} / {TOTAL_STEPS} 단계
          </div>
        </div>

        {/* Form Card */}
        <div className="card fade-up" style={{ padding: "28px 28px" }}>
          {step === 0 && (
            <StepOne data={data} update={update} />
          )}
          {step === 1 && (
            <StepTwo data={data} update={update} />
          )}
          {step === 2 && (
            <StepThree data={data} update={update} />
          )}
          {step === 3 && (
            <StepFour data={data} update={update} />
          )}
          {step === 4 && (
            <StepFive data={data} update={update} />
          )}

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 28,
              paddingTop: 20,
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <button
              className="btn-secondary"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              style={{ visibility: step === 0 ? "hidden" : "visible" }}
            >
              ← 이전
            </button>

            {step < TOTAL_STEPS - 1 ? (
              <button
                className="btn-primary"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
              >
                다음 →
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={() => {
                  setStep(TOTAL_STEPS);
                  generate();
                }}
                disabled={!canProceed()}
                style={{ background: "linear-gradient(135deg,#059669,#10b981)", boxShadow: "0 2px 8px rgba(16,185,129,0.3)" }}
              >
                🚀 사업계획서 생성
              </button>
            )}
          </div>
        </div>

        {/* Tips */}
        <div style={{ marginTop: 16, padding: "12px 16px", background: "#eff6ff", borderRadius: 10, border: "1px solid #bfdbfe" }}>
          <p style={{ fontSize: 12, color: "#1d4ed8", margin: 0 }}>
            💡 <strong>팁:</strong>{" "}
            {step === 0 && "사업명과 사업 개요를 명확하게 작성할수록 더 좋은 계획서가 생성됩니다."}
            {step === 1 && "시장 규모는 TAM, SAM, SOM 관점에서 작성하면 좋습니다."}
            {step === 2 && "제품의 차별화 포인트를 구체적으로 작성해 주세요."}
            {step === 3 && "온/오프라인 마케팅 채널을 모두 고려해 보세요."}
            {step === 4 && "초기 투자금 대비 수익성 분석이 중요합니다. 구체적인 수치를 입력하세요."}
          </p>
        </div>
      </main>
    </div>
  );
}

/* ── Step Components ── */

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          color: "#374151",
          marginBottom: 6,
        }}
      >
        {label}
        {required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {children}
    </div>
  );
}

function StepOne({ data, update }: { data: BusinessPlanData; update: (f: keyof BusinessPlanData, v: string) => void }) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#1e3a8a" }}>🏢 기본 정보</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>사업의 기본적인 정보를 입력해 주세요.</p>

      <Row>
        <Field label="사업명" required>
          <input className="input-field" value={data.businessName} onChange={(e) => update("businessName", e.target.value)} placeholder="예: 그린푸드 주식회사" />
        </Field>
        <Field label="업종" required>
          <select className="select-field" value={data.industry} onChange={(e) => update("industry", e.target.value)}>
            <option value="">업종 선택</option>
            {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
          </select>
        </Field>
      </Row>

      <Row>
        <Field label="사업 형태" required>
          <select className="select-field" value={data.businessType} onChange={(e) => update("businessType", e.target.value)}>
            <option value="">사업 형태 선택</option>
            {BUSINESS_TYPES.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
          </select>
        </Field>
        <Field label="창업자/팀 소개">
          <input className="input-field" value={data.founders} onChange={(e) => update("founders", e.target.value)} placeholder="예: CEO 홍길동(IT 10년 경력)" />
        </Field>
      </Row>

      <Field label="사업 지역">
        <input className="input-field" value={data.location} onChange={(e) => update("location", e.target.value)} placeholder="예: 서울시 강남구 / 전국 / 글로벌" />
      </Field>

      <Field label="사업 개요" required>
        <textarea className="textarea-field" value={data.overview} onChange={(e) => update("overview", e.target.value)} placeholder="어떤 문제를 해결하고, 어떤 방식으로 사업을 운영할지 설명해 주세요." style={{ minHeight: 110 }} />
      </Field>
    </div>
  );
}

function StepTwo({ data, update }: { data: BusinessPlanData; update: (f: keyof BusinessPlanData, v: string) => void }) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#1e3a8a" }}>📊 시장 분석</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>목표 시장과 경쟁 환경을 분석해 주세요.</p>

      <Row>
        <Field label="목표 시장" required>
          <textarea className="textarea-field" value={data.targetMarket} onChange={(e) => update("targetMarket", e.target.value)} placeholder="예: 20~40대 건강에 관심 있는 직장인" />
        </Field>
        <Field label="시장 규모">
          <textarea className="textarea-field" value={data.marketSize} onChange={(e) => update("marketSize", e.target.value)} placeholder="예: 국내 건강식품 시장 5조원 / 연 10% 성장" />
        </Field>
      </Row>

      <Field label="주요 경쟁사">
        <textarea className="textarea-field" value={data.competitors} onChange={(e) => update("competitors", e.target.value)} placeholder="예: A사(시장점유율 30%), B사(온라인 강자)" />
      </Field>

      <Field label="경쟁 우위" required>
        <textarea className="textarea-field" value={data.competitiveAdvantage} onChange={(e) => update("competitiveAdvantage", e.target.value)} placeholder="경쟁사 대비 우리의 차별화 포인트는 무엇인가요?" style={{ minHeight: 100 }} />
      </Field>
    </div>
  );
}

function StepThree({ data, update }: { data: BusinessPlanData; update: (f: keyof BusinessPlanData, v: string) => void }) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#1e3a8a" }}>💡 제품 및 서비스</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>제공하는 제품/서비스에 대해 설명해 주세요.</p>

      <Field label="제품/서비스 설명" required>
        <textarea className="textarea-field" value={data.productService} onChange={(e) => update("productService", e.target.value)} placeholder="어떤 제품 또는 서비스를 제공하나요?" style={{ minHeight: 100 }} />
      </Field>

      <Field label="핵심 가치 제안" required>
        <textarea className="textarea-field" value={data.uniqueValue} onChange={(e) => update("uniqueValue", e.target.value)} placeholder="고객이 우리 제품을 선택해야 하는 이유는 무엇인가요?" />
      </Field>

      <Row>
        <Field label="주요 기능/특징">
          <textarea className="textarea-field" value={data.keyFeatures} onChange={(e) => update("keyFeatures", e.target.value)} placeholder="핵심 기능 또는 특징 3~5가지" />
        </Field>
        <Field label="가격 전략">
          <textarea className="textarea-field" value={data.pricingStrategy} onChange={(e) => update("pricingStrategy", e.target.value)} placeholder="예: 월 구독 29,000원 / 프리미엄 99,000원" />
        </Field>
      </Row>
    </div>
  );
}

function StepFour({ data, update }: { data: BusinessPlanData; update: (f: keyof BusinessPlanData, v: string) => void }) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#1e3a8a" }}>📣 마케팅 전략</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>고객을 확보하고 성장하기 위한 전략을 설명해 주세요.</p>

      <Row>
        <Field label="마케팅 채널" required>
          <textarea className="textarea-field" value={data.marketingChannels} onChange={(e) => update("marketingChannels", e.target.value)} placeholder="예: SNS, 유튜브, 검색광고, 오프라인 이벤트" />
        </Field>
        <Field label="고객 획득 전략" required>
          <textarea className="textarea-field" value={data.customerAcquisition} onChange={(e) => update("customerAcquisition", e.target.value)} placeholder="예: 무료 체험 → 유료 전환, 바이럴 리워드" />
        </Field>
      </Row>

      <Row>
        <Field label="영업 전략">
          <textarea className="textarea-field" value={data.salesStrategy} onChange={(e) => update("salesStrategy", e.target.value)} placeholder="예: B2B 직접 영업, B2C 온라인 판매" />
        </Field>
        <Field label="파트너십">
          <textarea className="textarea-field" value={data.partnerships} onChange={(e) => update("partnerships", e.target.value)} placeholder="예: 대형마트 입점, 기업 복지 플랫폼 제휴" />
        </Field>
      </Row>
    </div>
  );
}

function StepFive({ data, update }: { data: BusinessPlanData; update: (f: keyof BusinessPlanData, v: string) => void }) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#1e3a8a" }}>💰 재무 계획</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>사업의 재무적 계획을 입력해 주세요.</p>

      <Row>
        <Field label="초기 투자 규모" required>
          <input className="input-field" value={data.initialInvestment} onChange={(e) => update("initialInvestment", e.target.value)} placeholder="예: 5,000만원 (자기자본 3,000만원 + 대출 2,000만원)" />
        </Field>
        <Field label="수익 모델" required>
          <input className="input-field" value={data.revenueModel} onChange={(e) => update("revenueModel", e.target.value)} placeholder="예: 구독료, 제품 판매, 광고, 수수료" />
        </Field>
      </Row>

      <Row>
        <Field label="월 예상 매출" required>
          <input className="input-field" value={data.monthlyRevenue} onChange={(e) => update("monthlyRevenue", e.target.value)} placeholder="예: 1차년도 월 500만원, 2차년도 월 2,000만원" />
        </Field>
        <Field label="손익분기점">
          <input className="input-field" value={data.breakEvenPoint} onChange={(e) => update("breakEvenPoint", e.target.value)} placeholder="예: 창업 후 18개월 (누적 매출 1억 달성 시)" />
        </Field>
      </Row>

      <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "14px 16px", marginTop: 8 }}>
        <p style={{ fontSize: 13, color: "#166534", margin: 0 }}>
          ✅ 모든 정보를 입력하셨습니다! <strong>사업계획서 생성</strong> 버튼을 클릭하면 Claude AI가 전문적인 사업계획서를 작성해 드립니다.
        </p>
      </div>
    </div>
  );
}
