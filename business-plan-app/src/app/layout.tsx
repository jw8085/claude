import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "사업계획서 AI 작성기 | Business Plan AI",
  description: "AI가 도와주는 전문적인 사업계획서 작성 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
