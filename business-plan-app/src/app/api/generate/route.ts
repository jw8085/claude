import Anthropic from "@anthropic-ai/sdk";
import { type NextRequest } from "next/server";
import { type BusinessPlanData } from "@/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  const data: BusinessPlanData = await request.json();

  const prompt = buildPrompt(data);

  const stream = client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    system: `당신은 대한민국 최고의 사업계획서 전문 컨설턴트입니다.
투자자와 금융기관에 제출 가능한 수준의 전문적이고 설득력 있는 사업계획서를 작성합니다.
다음 형식으로 정확하게 작성해 주세요:

[경영진 요약]
(내용)

[시장 분석]
(내용)

[제품 및 서비스]
(내용)

[마케팅 전략]
(내용)

[재무 계획]
(내용)

[결론 및 비전]
(내용)

각 섹션은 구체적인 데이터, 분석, 전략을 포함하여 2~4단락으로 작성하세요.
한국어로 전문적이고 격식 있게 작성하며, 숫자와 구체적인 목표를 포함하세요.`,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const chunk = encoder.encode(event.delta.text);
            controller.enqueue(chunk);
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}

function buildPrompt(data: BusinessPlanData): string {
  return `다음 정보를 바탕으로 완성도 높은 사업계획서를 작성해 주세요:

## 기본 정보
- 사업명: ${data.businessName}
- 업종: ${data.industry}
- 사업 형태: ${data.businessType}
- 사업 개요: ${data.overview}
- 창업자/팀: ${data.founders}
- 사업 지역: ${data.location}

## 시장 분석
- 목표 시장: ${data.targetMarket}
- 시장 규모: ${data.marketSize}
- 주요 경쟁사: ${data.competitors}
- 경쟁 우위: ${data.competitiveAdvantage}

## 제품/서비스
- 제품/서비스 설명: ${data.productService}
- 핵심 가치 제안: ${data.uniqueValue}
- 주요 기능/특징: ${data.keyFeatures}
- 가격 전략: ${data.pricingStrategy}

## 마케팅 전략
- 마케팅 채널: ${data.marketingChannels}
- 고객 획득 전략: ${data.customerAcquisition}
- 영업 전략: ${data.salesStrategy}
- 파트너십: ${data.partnerships}

## 재무 계획
- 초기 투자 규모: ${data.initialInvestment}
- 수익 모델: ${data.revenueModel}
- 월 예상 매출: ${data.monthlyRevenue}
- 손익분기점: ${data.breakEvenPoint}

위 정보를 기반으로 투자자와 금융기관에 제출할 수 있는 수준의 전문적인 사업계획서를 작성해주세요.`;
}
