import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  requestsCount: number;
  onOpenRequests: () => void;
  onJumpToAddService: () => void;
}

export function Header({
  requestsCount,
  onOpenRequests,
  onJumpToAddService,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-line Brand Logo + Wordmark */}
        <a
          href="#top"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded-md whitespace-nowrap shrink-0"
        >
          <BrandLogo />
        </a>

        {/* Zone 2: 4 concise single-line text links */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <a
            href="#directory"
            className="hover:text-[#0F2547] hover:underline underline-offset-8 decoration-[#0D9488]/60 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
          >
            الخدمات
          </a>
          <a
            href="#categories"
            className="hover:text-[#0F2547] hover:underline underline-offset-8 decoration-[#0D9488]/60 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
          >
            التصنيفات
          </a>
          <a
            href="#payment"
            className="hover:text-[#0F2547] hover:underline underline-offset-8 decoration-[#0D9488]/60 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
          >
            الدفع
          </a>
          <button
            type="button"
            onClick={onOpenRequests}
            className="hover:text-[#0F2547] hover:underline underline-offset-8 decoration-[#0D9488]/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
          >
            طلباتي
            {requestsCount > 0 && (
              <span className="mr-1.5 text-[#0F766E] font-semibold tabular-nums">
                ({requestsCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenRequests}
            className="md:hidden text-sm font-semibold text-slate-700 hover:text-[#0F2547] px-2.5 py-2 min-h-[40px] whitespace-nowrap shrink-0 cursor-pointer"
          >
            طلباتي{requestsCount > 0 ? ` (${requestsCount})` : ''}
          </button>
          <button
            type="button"
            onClick={onJumpToAddService}
            className="px-4 py-2 min-h-[40px] text-sm font-semibold text-white bg-[#0F2547] rounded-lg hover:bg-[#173666] active:scale-[0.99] shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D9488]"
          >
            أضف خدمتك
          </button>
        </div>
      </div>
    </header>
  );
}
