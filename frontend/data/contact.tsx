import { HeroData } from "@/components/ui/Hero";
import { ContactCardData } from "@/components/contact/ContactCard";

interface ContactSectionData {
  title: string;
  icon: React.ReactNode;
  cards: ContactCardData[];
}

export const heroData: HeroData = {
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 sm:h-10 sm:w-10 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  title: "Contact Us",
  subtitle: "お気軽にお問い合わせください",
  description:
    "インフラ点検に関するご質問やご相談がございましたら、お気軽にご連絡ください。",
};

export const contactSectionData: ContactSectionData = {
  title: "連絡先情報",
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 sm:h-6 sm:w-6 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  cards: [
    {
      title: "メール",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-7 sm:w-7 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      content: (
        <a
          href="mailto:a2511519@sendai-nct.jp"
          className="text-gray-600 hover:text-black transition-colors duration-200 text-sm sm:text-base break-all"
        >
          a2511519@sendai-nct.jp
        </a>
      ),
    },
    {
      title: "電話",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-7 sm:w-7 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      content: (
        <a
          href="tel:03-1234-5678"
          className="text-gray-600 hover:text-black transition-colors duration-200 text-sm sm:text-base"
        >
          022-351-5537
        </a>
      ),
    },
    {
      title: "住所",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-7 sm:w-7 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      content: (
        <div className="text-gray-600 text-sm sm:text-base leading-relaxed">
          <p>〒989-3128</p>
          <p>宮城県仙台市青葉区中央4-16-1</p>
          <p className="font-medium">仙台高専</p>
        </div>
      ),
    },
  ],
};
