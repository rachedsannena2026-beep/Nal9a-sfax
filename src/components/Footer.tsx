import { BrandLogo } from './BrandLogo';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <a href="#top" className="inline-block">
            <BrandLogo />
          </a>
          <p className="text-sm text-slate-500">
            منصة موحدة للعثور على الخدمات الموثوقة في ولاية صفاقس وحجزها
            بشفافية.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
          <a
            href="#directory"
            className="hover:text-[#0F2547] transition-colors whitespace-nowrap"
          >
            دليل الخدمات
          </a>
          <a
            href="#faq"
            className="hover:text-[#0F2547] transition-colors whitespace-nowrap"
          >
            الأسئلة الشائعة
          </a>
          <a
            href="#payment"
            className="hover:text-[#0F2547] transition-colors whitespace-nowrap"
          >
            طرق الدفع
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#0F2547] transition-colors whitespace-nowrap"
          >
            كيف نعمل
          </a>
          <a
            href="#add-service"
            className="hover:text-[#0F2547] transition-colors whitespace-nowrap"
          >
            انضم كمزود خدمة
          </a>
          <a
            href="mailto:contact@winnal9a.tn"
            dir="ltr"
            className="hover:text-[#0F766E] transition-colors whitespace-nowrap"
          >
            contact@winnal9a.tn
          </a>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <span>© 2026 winnal9a. جميع الحقوق محفوظة.</span>
        <span>أسعار تقديرية شفافة وحجز مباشر مع المزودين في صفاقس.</span>
      </div>
    </footer>
  );
}
