# 사업계획서 AI 작성기

Claude AI가 도와주는 전문적인 사업계획서 작성 서비스입니다.

## 기능

- **5단계 마법사** — 기본 정보, 시장 분석, 제품/서비스, 마케팅 전략, 재무 계획을 순서대로 입력
- **AI 자동 생성** — Claude Opus 4.7이 스트리밍으로 전문적인 사업계획서 작성
- **실시간 미리보기** — 생성되는 내용을 실시간으로 확인
- **인쇄/PDF 저장** — 브라우저 인쇄 기능으로 PDF 저장 가능
- **한국어 UI** — 완전한 한국어 인터페이스

## 시작하기

```bash
cd business-plan-app
npm install

# .env.local 파일에 API 키 설정
echo "ANTHROPIC_API_KEY=your_key_here" > .env.local

npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인하세요.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **AI**: Claude Opus 4.7 (Anthropic SDK, Adaptive Thinking, Streaming)
- **Styling**: Tailwind CSS + Custom CSS
- **Language**: TypeScript
