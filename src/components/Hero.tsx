import {
  Clock,
  CreditCard,
  Layers,
  MapPin,
  Search,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { CATEGORY_OPTIONS, SFAX_AREAS } from '../data/services';
import { ServiceCategory } from '../types/service';

interface HeroProps {
  searchQuery: string;
  selectedCategory: ServiceCategory;
  selectedCity: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: ServiceCategory) => void;
  onCityChange: (city: string) => void;
  onSubmitSearch: () => void;
  totalServicesCount: number;
}

export function Hero({
  searchQuery,
  selectedCategory,
  selectedCity,
  onSearchChange,
  onCategoryChange,
  onCityChange,
  onSubmitSearch,
  totalServicesCount,
}: HeroProps) {
  const [imgError, setImgError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmitSearch();
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-hero-premium border-b border-slate-200/80"
    >
      {/* Subtle Abstract Ambient Shapes with Soft Blur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-24 w-[460px] h-[460px] rounded-full bg-[#1E3A8A]/[0.06] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 -left-24 w-[380px] h-[380px] rounded-full bg-[#14B8A6]/[0.08] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/3 w-[320px] h-[220px] rounded-full bg-[#0F2547]/[0.04] blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* 2-Column Balanced Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Content Column */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold text-[#0F766E]">
                دليل الخدمات الشامل · ولاية صفاقس
              </p>

              <h1
                className="font-bold text-[#0F172A] leading-[1.18] tracking-tight text-balance"
                style={{ fontSize: 'clamp(2.1rem, 3.8vw, 3.25rem)' }}
              >
                كل الخدمات في صفاقس، تلقاها بوضوح في{' '}
                <span
                  dir="ltr"
                  className="font-brand text-[#0F2547] inline-block"
                >
                  winnal9a
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                من صيانة المنزل والسباكة والنقل إلى البرمجة والتصميم والاستشارات
                في مختلف مناطق ولاية صفاقس. قارن المزودين المعتمدين، اطّلع على
                الأسعار التقديرية، واحجز موعدك مباشرة في دقائق.
              </p>
            </div>

            {/* Unified Elevated Search Bar */}
            <form
              onSubmit={handleSubmit}
              className="bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-[0_8px_30px_-8px_rgba(15,37,71,0.1)] space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <label className="sm:col-span-5 relative block">
                  <span className="sr-only">ابحث عن خدمة</span>
                  <Search
                    className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="شنوة تلوج؟ (كهربائي، سباك، نقل...)"
                    className="w-full h-11 pr-10 pl-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/15 transition-colors"
                  />
                </label>

                <label className="sm:col-span-3 relative block">
                  <span className="sr-only">التصنيف</span>
                  <Layers
                    className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) =>
                      onCategoryChange(e.target.value as ServiceCategory)
                    }
                    className="w-full h-11 pr-9 pl-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/15 transition-colors cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="sm:col-span-2 relative block">
                  <span className="sr-only">المنطقة في صفاقس</span>
                  <MapPin
                    className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <select
                    value={selectedCity}
                    onChange={(e) => onCityChange(e.target.value)}
                    className="w-full h-11 pr-9 pl-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/15 transition-colors cursor-pointer"
                  >
                    {SFAX_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full h-11 px-4 bg-[#0F2547] hover:bg-[#173666] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D9488]"
                  >
                    ابحث الآن
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Media Column */}
          <div className="lg:col-span-5">
            <div className="relative h-64 sm:h-80 lg:h-full min-h-[300px] rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-100 shadow-[0_14px_34px_-10px_rgba(15,37,71,0.16)]">
              {!imgError ? (
                <img
                  src="/src/assets/images/hero_winnal9a_services_1795193380836.jpg"
                  alt="حرفيون وخبراء خدمات يعملون في استوديو عصري ضمن منصة winnal9a"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50 flex flex-col items-center justify-center p-6 text-center gap-3">
                  <Wrench className="w-10 h-10 text-[#0F2547]" />
                  <p className="font-semibold text-slate-800">
                    منصة winnal9a للخدمات في ولاية صفاقس
                  </p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B192C]/90 via-[#0B192C]/45 to-transparent p-5">
                <p className="text-sm font-medium text-white">
                  حرفيون ومختصون موثوقون في ولاية صفاقس
                </p>
                <p className="text-xs text-slate-200 mt-0.5">
                  تغطية لمختلف مناطق ومعتمديات ولاية صفاقس
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column KPI / Trust Strip */}
        <div className="mt-10 pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-[#0F2547] shrink-0">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0F172A] tabular-nums">
                +{totalServicesCount * 20}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                مزود خدمة ومؤسسة معتمدة في صفاقس
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-[#0F766E] shrink-0">
              <Layers className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0F172A] tabular-nums">
                7 قطاعات
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                صيانة، برمجة، نقل، تنظيف واستشارات
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-[#0F2547] shrink-0">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0F172A] tabular-nums">
                أقل من 90 دق
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                متوسط زمن الرد على الطلبات
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-[#0F766E] shrink-0">
              <CreditCard className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0F172A]">دفع مرن وآمن</p>
              <p className="text-xs text-slate-600 mt-0.5">
                نقداً عند الإنجاز أو عبر D17 والبطاقة
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
