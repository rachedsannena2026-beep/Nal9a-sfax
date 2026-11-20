import {
  CalendarCheck,
  CheckCircle2,
  Scale,
  Search,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import {
  CATEGORY_IMAGES,
  CATEGORY_OPTIONS,
  SFAX_AREAS,
} from '../data/services';
import { ServiceCategory, ServiceItem } from '../types/service';

interface AddServiceSectionProps {
  onAddService: (newService: ServiceItem) => void;
}

export function AddServiceSection({ onAddService }: AddServiceSectionProps) {
  const [title, setTitle] = useState('');
  const [providerName, setProviderName] = useState('');
  const [category, setCategory] =
    useState<Exclude<ServiceCategory, 'all'>>('maintenance');
  const [city, setCity] = useState('صفاقس المدينة');
  const [priceFrom, setPriceFrom] = useState('50');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [publishedTitle, setPublishedTitle] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedPrice = Number(priceFrom);
    if (title.trim().length < 5) {
      setErrorMsg('يرجى كتابة عنوان واضح للخدمة (5 أحرف على الأقل).');
      return;
    }
    if (providerName.trim().length < 2) {
      setErrorMsg('يرجى كتابة اسم المزود أو الورشة.');
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setErrorMsg('يرجى إدخال سعر ابتدائي صحيح أكبر من صفر.');
      return;
    }
    if (description.trim().length < 15) {
      setErrorMsg('يرجى إضافة وصف واضح للخدمة (15 حرفاً على الأقل).');
      return;
    }

    const categoryMeta = CATEGORY_OPTIONS.find((c) => c.id === category);

    const created: ServiceItem = {
      id: `srv-custom-${Date.now()}`,
      title: title.trim(),
      category,
      categoryLabel: categoryMeta ? categoryMeta.label : 'خدمات عامة',
      providerName: providerName.trim(),
      city,
      priceFrom: parsedPrice,
      priceUnit: 'د.ت',
      responseTime: 'خلال ساعة',
      responseMinutes: 60,
      availability: 'متاح اليوم',
      rating: 5.0,
      reviewCount: 1,
      description: description.trim(),
      deliverables: [
        'تواصل مباشر لتحديد تفاصيل التنفيذ',
        'تسعير واضح ومتفق عليه قبل بدء العمل',
        'التزام بالمواعيد وجودة التسليم',
      ],
      imageUrl: CATEGORY_IMAGES[category],
      verified: true,
      reviews: [],
    };

    onAddService(created);
    setPublishedTitle(created.title);
    setTitle('');
    setProviderName('');
    setPriceFrom('50');
    setDescription('');
  };

  return (
    <section
      id="how-it-works"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Editorial Numbered Steps with Structured Icon Frames */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#0F766E]">
              خطوات واضحة وسريعة
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              كيف تستفيد من winnal9a؟
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              صممنا المنصة لتختصر عليك البحث العشوائي وتوصلك مباشرة إلى الشخص
              المناسب في صفاقس بتسعير واضح.
            </p>
          </div>

          <div className="divide-y divide-slate-200/80 card-premium rounded-2xl px-6">
            <div className="py-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-center text-[#0F2547] shrink-0 mt-0.5">
                <Search className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[#0F172A]">
                  01. ابحث حسب الحاجة والمنطقة
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  اختر التصنيف أو اكتب نوع الخدمة المطلوبة، وحدد منطقتك في ولاية
                  صفاقس للوصول إلى الأقرب إليك.
                </p>
              </div>
            </div>

            <div className="py-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-center text-[#0F766E] shrink-0 mt-0.5">
                <Scale className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[#0F172A]">
                  02. قارن التقييمات والأسعار الابتدائية
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  اطّلع على تفاصيل ما يشمله العرض، متوسط زمن الاستجابة، وتجارب
                  العملاء السابقين قبل التواصل.
                </p>
              </div>
            </div>

            <div className="py-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-center text-[#0F2547] shrink-0 mt-0.5">
                <CalendarCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[#0F172A]">
                  03. احجز موعدك واختر طريقة الدفع
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  أرسل طلبك خلال ثوانٍ واختر الدفع نقداً عند الإنجاز أو إلكترونياً
                  عبر D17 والبطاقة البنكية مع رقم مرجعي في قائمة &laquo;طلباتي&raquo;.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Submission Form */}
        <div
          id="add-service"
          className="lg:col-span-7 card-premium rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#0F766E]">
              لمزودي الخدمات في صفاقس
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              هل تقدم خدمة في ولاية صفاقس؟ أضفها إلى دليل winnal9a
            </h2>
            <p className="text-sm text-slate-600">
              انشر خدمتك الآن لتظهر مباشرة في نتائج البحث أمام أهالي صفاقس
              الباحثين عن تخصصك.
            </p>
          </div>

          {publishedTitle && (
            <div className="p-4 bg-teal-50/80 border border-teal-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
              <div className="text-sm text-teal-950">
                <p className="font-semibold">
                  تمت إضافة خدمتك بنجاح: {publishedTitle}
                </p>
                <a
                  href="#directory"
                  className="inline-block mt-1 font-medium text-[#0F766E] underline underline-offset-4"
                >
                  تصفحها الآن في دليل الخدمات
                </a>
              </div>
            </div>
          )}

          {errorMsg && (
            <p
              role="alert"
              className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg p-3"
            >
              {errorMsg}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-700">
                  عنوان الخدمة
                </span>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: صيانة أجهزة التبريد المنزلية"
                  className="w-full h-11 px-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#0D9488]"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-700">
                  اسم المزود أو المؤسسة
                </span>
                <input
                  type="text"
                  required
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="مثال: ورشة النور للتبريد"
                  className="w-full h-11 px-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#0D9488]"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-700">
                  التصنيف
                </span>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as Exclude<ServiceCategory, 'all'>
                    )
                  }
                  className="w-full h-11 px-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-[#0D9488]"
                >
                  {CATEGORY_OPTIONS.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-700">
                  المنطقة في ولاية صفاقس
                </span>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 px-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-[#0D9488]"
                >
                  {SFAX_AREAS.filter((a) => a !== 'كل مناطق صفاقس').map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-700">
                  السعر الابتدائي (د.ت)
                </span>
                <input
                  type="number"
                  min={5}
                  required
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-900 tabular-nums focus:bg-white focus:outline-none focus:border-[#0D9488]"
                />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-700">
                وصف الخدمة وما تقدمه للعميل
              </span>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اشرح خبرتك، ما يشمله السعر الابتدائي، وساعات العمل المتاحة..."
                className="w-full p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#0D9488] resize-none"
              />
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-500">
                يتم نشر الخدمة فوراً في دليل المنصة.
              </p>
              <button
                type="submit"
                className="px-6 py-2.5 min-h-[44px] bg-[#0F2547] hover:bg-[#173666] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D9488]"
              >
                نشر الخدمة الآن
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
