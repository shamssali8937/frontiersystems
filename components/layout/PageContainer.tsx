import { Header } from "./Header";
import { Footer } from "./Footer";
import { SkipToContent } from "./SkipToContent";

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PageContainer — Standard full-height layout wrapper.
 * Integrates SkipToContent accessibility link, sticky Header, semantic main, and Footer.
 */
export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D0E] text-[#F5F5F3] selection:bg-[#63C7D9]/20 selection:text-[#F5F5F3]">
      <SkipToContent />
      <Header />
      <main id="main-content" tabIndex={-1} className={`flex-1 focus:outline-none ${className}`.trim()}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
