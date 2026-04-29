export interface BusinessPlanData {
  // Step 1: 기본 정보
  businessName: string;
  industry: string;
  businessType: string;
  overview: string;
  founders: string;
  location: string;

  // Step 2: 시장 분석
  targetMarket: string;
  marketSize: string;
  competitors: string;
  competitiveAdvantage: string;

  // Step 3: 제품/서비스
  productService: string;
  uniqueValue: string;
  keyFeatures: string;
  pricingStrategy: string;

  // Step 4: 마케팅 전략
  marketingChannels: string;
  customerAcquisition: string;
  salesStrategy: string;
  partnerships: string;

  // Step 5: 재무 계획
  initialInvestment: string;
  revenueModel: string;
  monthlyRevenue: string;
  breakEvenPoint: string;
}

export interface GeneratedPlan {
  executiveSummary: string;
  marketAnalysis: string;
  productService: string;
  marketingStrategy: string;
  financialPlan: string;
  conclusion: string;
}

export const INDUSTRIES = [
  "IT/소프트웨어",
  "이커머스/유통",
  "식음료",
  "제조업",
  "서비스업",
  "교육",
  "헬스케어",
  "부동산",
  "금융/핀테크",
  "미디어/엔터테인먼트",
  "농업/식품",
  "물류/운송",
  "기타",
];

export const BUSINESS_TYPES = [
  "스타트업",
  "중소기업",
  "개인사업자",
  "프랜차이즈",
  "소셜 벤처",
  "법인 설립 예정",
];
