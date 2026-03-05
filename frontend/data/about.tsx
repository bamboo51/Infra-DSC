import { HeroData } from "@/components/ui/Hero";
import { InfoCardData } from "@/components/about/InfoCard";
import { TimelineItemData } from "@/components/about/Timeline";
import { CtaButtonData } from "@/components/about/CallToAction";

interface BackgroundSectionData {
  title: string;
  icon: React.ReactNode;
  cards: InfoCardData[];
}

interface JourneySectionData {
  title: string;
  icon: React.ReactNode;
  timeline: TimelineItemData[];
}

interface CtaSectionData {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttons: CtaButtonData[];
}

export const heroData: HeroData = {
  icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 2l-4 20" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 2l4 20" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 2v20" strokeDasharray="4 4" />
    </svg>
  ),
  title: "Infra-DSC",
  subtitle: "目指そう。安全な道路をみんなへ。",
  description: "私たちは安全な移動の実現をお手伝いします。",
};


export const backgroundSection: BackgroundSectionData = {
  title: "Background",
  icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  cards: [
    {
      title: "The Challenge",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>,
      content: ["普段使っている道路がデコボコしていることが気になったことはありませんか？", "日本ではこうしたインフラの老朽化が社会課題となっています。路面状態の把握は管理者による目視で行われることが多く，非効率的です。"],
    },
    {
      title: "Our Solution",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
      content: ["私たちはインフラ点検のこのような課題を解決するために研究に取り組んでいます。", "「郵便やごみ収集と連携した網羅的な路面データの収集」と「AIによる劣化の自動検出、定量的な評価」を目指します。"],
    },
    {
      title: "Impact",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      content: ["私たちのソリューションによってより先進的なインフラ維持管理プラットフォームを提供します。"],
    },
  ] as InfoCardData[],
}

export const journeySection: JourneySectionData = {
  title: "Project Journey",
  icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  timeline: [
    { year: "2023", title: "Road Damage Scanner (RDS)", points: ["道路劣化の問題に着目", "現行の目視点検の限界と課題を調査", "AI技術によるBounding Box形式の劣化検出", "DCON 2023 全国大会 本選出場"] },
    { year: "2024", title: "Infra-DSC 1.0", points: ["RDSをさらに改良・発展", "AI技術によるBounding Box形式に加えてSegmentationと割れ率の計算の劣化検出の試み（20枚程度の画像で学習）", "AWS上での実用化", "東北社会課題解決型クリエーター発掘・育成プログラム SICA 2024 採択"] },
    { year: "2025", title: "New Infra-DSC", points: ["Infra-DSC 1.0に基づいて改良・発展", "既存のシステムをモダン化","300枚程度の手動アノテーションマスクを使用"], isCurrent: true },
  ] as TimelineItemData[],
};

export const ctaSection: CtaSectionData = {
  icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  title: "安全な道路を一緒に作ろう！",
  description: "AI駆動の損傷検出の力を体験し、インフラ管理を次のレベルに引き上げましょう。",
  buttons: [
    { href: "/", text: "Try Now", variant: 'primary', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg> },
    { href: "/contact", text: "Contact Us", variant: 'secondary', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  ] as CtaButtonData[],
};