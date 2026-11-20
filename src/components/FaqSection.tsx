import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

type FaqTopic = 'all' | 'booking' | 'payment' | 'coverage';

interface FaqItem {
  id: string;
  topic: Exclude<FaqTopic, 'all'>;
  topicLabel: string;
  question: string;
  answer: string;
}

const FAQ_TOPICS: { id: FaqTopic; label: string }[] = [
  { id: 'all', label: 'كل الأسئلة' },
  { id: 'booking', label: 'الحجز والمواعيد' },
  { id: 'payment', label: 'الدفع والفواتير' },
  { id: 'coverage', label: 'نطاق صفاقس والضمان' },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    topic: 'booking',
    topicLabel: 'الحجز والمواعيد',
    question: 'كيف أحجز خدمة في ولاية صفاقس عبر منصة winnal9a؟',
    answer:
      'اختر الخدمة المناسبة من الدليل، ثم اضغط على «التفاصيل والحجز». أدخل اسمك، رقم هاتفك، منطقتك داخل ولاية صفاقس، والموعد المفضل، ثم أرسل الطلب لتحصل فوراً على رقم مرجعي (#WN-xxxx) يمكنك متابعته في قائمة «طلباتي».',
  },
  {
    id: 'faq-2',
    topic: 'payment',
    topicLabel: 'الدفع والفواتير',
    question: 'ما هي طرق الدفع المتاحة عند حجز الخدمات في صفاقس؟',
    answer:
      'نوفر 4 خيارات مرنة تناسب جميع العملاء: الدفع نقداً مباشرة عند إتمام الخدمة، الدفع عبر محفظة D17 أو Flouci، الدفع بالبطاقات البنكية التونسية (CIB وVisa وMastercard)، بالإضافة إلى التحويل البنكي (RIB) للشركات والمشاريع.',
  },
  {
    id: 'faq-3',
    topic: 'payment',
    topicLabel: 'الدفع والفواتير',
    question: 'هل يمكنني تسديد قيمة الحجز إلكترونياً بعد إرسال الطلب؟',
    answer:
      'نعم. إذا اخترت الدفع عند الإنجاز عند الحجز ثم رغبت لاحقاً في التسوية عبر D17 أو البطاقة البنكية، يمكنك التوجه إلى قسم «الدفع والمعاملات المالية» أو الضغط على «دفع إلكتروني الآن» من داخل قائمة «طلباتي» وإدخال رقم المرجع لإتمام الدفع فوراً.',
  },
  {
    id: 'faq-4',
    topic: 'payment',
    topicLabel: 'الدفع والفواتير',
    question: 'هل تفرض المنصة عمولة إضافية على العميل، وهل الأسعار نهائية؟',
    answer:
      'عمولة المنصة على العميل هي 0 د.ت. الأسعار الظاهرة في بطاقات الخدمات هي أسعار ابتدائية واضحة للخدمة الأساسية، ويتم تأكيد التكلفة النهائية بشفافية مع مزود الخدمة قبل بدء التنفيذ إذا تطلبت الحالة قطع غيار أو أشغالاً إضافية.',
  },
  {
    id: 'faq-5',
    topic: 'coverage',
    topicLabel: 'نطاق صفاقس والضمان',
    question: 'ما هي المناطق والمعتمديات المشمولة بالخدمة في ولاية صفاقس؟',
    answer:
      'المنصة مخصصة حصرياً لولاية صفاقس وتغطي صفاقس المدينة، ساقية الزيت، ساقية الداير، قرمدة، طريق العين، طينة، والمحرس، مع إمكانية تحديد منطقتك بدقة من شريط البحث للوصول إلى أقرب مزود خدمة.',
  },
  {
    id: 'faq-6',
    topic: 'booking',
    topicLabel: 'الحجز والمواعيد',
    question: 'كيف أؤكد إتمام الخدمة وأقيّم المزود، وماذا لو رغبت في إلغاء الطلب؟',
    answer:
      'افتح قائمة «طلباتي» من الشريط العلوي: يمكنك إلغاء أي طلب لم يتم البدء فيه عبر أيقونة الحذف، وعند انتهاء المزود من عمله اضغط على «تأكيد إتمام الخدمة» ليظهر لك نموذج التقييم بالنجوم والتعليق، وبمجرد إرساله يُحتسب تلقائياً ضمن متوسط تقييم الخدمة.',
  },
  {
    id: 'faq-7',
    topic: 'coverage',
    topicLabel: 'نطاق صفاقس والضمان',
    question: 'هل خدمات الصيانة والحرف تشمل ضماناً على العمل المنجز؟',
    answer:
      'نعم، يحرص المزودون المعتمدون في قطاع الصيانة والسباكة والكهرباء على تقديم تقرير فحص واضح وضمان على اليد العاملة أو قطع الغيار المستبدلة وفق ما هو موضح في تفاصيل كل عرض قبل الحجز.',
  },
];

export function FaqSection() {
  const [selectedTopic, setSelectedTopic] = useState<FaqTopic>('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string>(FAQ_ITEMS[0].id);

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      const topicMatch =
        selectedTopic === 'all' || item.topic === selectedTopic;
      const queryMatch =
        q === '' ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.topicLabel.toLowerCase().includes(q);
      return topicMatch && queryMatch;
    });
  }, [selectedTopic, query]);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? '' : id));
  };

  return (
    <section
      id="faq"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Right/Start Column: Section Heading, Topic Filters & Search */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#0F766E]">
              إجابات سريعة وواضحة
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] leading-snug">
              الأسئلة الشائعة حول الحجز والدفع في صفاقس
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              تصفح الإجابات عن أكثر الاستفسارات شيوعاً حول آلية طلب الخدمات،
              المناطق المغطاة في ولاية صفاقس، وخيارات الدفع الآمنة.
            </p>
          </div>

          {/* Search input inside FAQ */}
          <label className="relative block">
            <span className="sr-only">ابحث في الأسئلة الشائعة</span>
            <Search
              className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بسؤال أو كلمة (مثلاً: D17، إلغاء، ضمان...)"
              className="w-full h-11 pr-10 pl-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/15 transition-colors"
            />
          </label>

          {/* Topic Filter Buttons */}
          <div
            role="tablist"
            aria-label="تصنيفات الأسئلة الشائعة"
            className="flex flex-wrap items-center gap-2"
          >
            {FAQ_TOPICS.map((topic) => {
              const isActive = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`px-3.5 py-2 min-h-[40px] text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                    isActive
                      ? 'bg-[#0F2547] text-white border-[#0F2547] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-[#0F2547]'
                  }`}
                >
                  {topic.label}
                </button>
              );
            })}
          </div>

          {/* Direct Support Note */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-start gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-center text-[#0F766E] shrink-0">
              <HelpCircle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-[#0F172A]">
                لم تجد إجابة لسؤالك؟
              </p>
              <p className="text-slate-600 leading-relaxed">
                يمكنك التواصل معنا مباشرة عبر{' '}
                <a
                  href="mailto:contact@winnal9a.tn"
                  dir="ltr"
                  className="font-semibold text-[#0F766E] hover:underline"
                >
                  contact@winnal9a.tn
                </a>{' '}
                أو البدء بتصفح{' '}
                <a
                  href="#payment"
                  className="font-semibold text-[#0F2547] hover:underline"
                >
                  خيارات الدفع
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Left/End Column: Accordion Questions List */}
        <div className="lg:col-span-7">
          {filteredFaqs.length === 0 ? (
            <div className="card-premium rounded-2xl p-10 text-center space-y-3">
              <p className="text-sm font-semibold text-[#0F172A]">
                لا توجد أسئلة مطابقة لبحثك الحالي
              </p>
              <p className="text-xs text-slate-500">
                جرّب كلمة بحث أخرى أو اختر «كل الأسئلة».
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedTopic('all');
                }}
                className="px-4 py-2 min-h-[40px] bg-[#0F2547] hover:bg-[#173666] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                عرض كل الأسئلة
              </button>
            </div>
          ) : (
            <div className="card-premium rounded-2xl divide-y divide-slate-200/80 overflow-hidden">
              {filteredFaqs.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <div key={item.id} className="bg-white">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      onClick={() => handleToggle(item.id)}
                      className="w-full px-5 sm:px-6 py-5 text-right flex items-start justify-between gap-4 hover:bg-[#F8FAFC]/80 transition-colors cursor-pointer focus-visible:outline-none focus-visible:bg-[#F8FAFC]"
                    >
                      <div className="space-y-1">
                        <span className="block text-xs font-medium text-[#0F766E]">
                          {item.topicLabel}
                        </span>
                        <span
                          className={`block text-base font-bold leading-snug ${
                            isOpen ? 'text-[#0F2547]' : 'text-[#0F172A]'
                          }`}
                        >
                          {item.question}
                        </span>
                      </div>

                      <span
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-1 transition-colors ${
                          isOpen
                            ? 'bg-[#0F2547] border-[#0F2547] text-white'
                            : 'bg-[#F8FAFC] border-slate-200 text-slate-500'
                        }`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        id={`faq-panel-${item.id}`}
                        className="px-5 sm:px-6 pb-5 pt-0 text-sm text-slate-600 leading-relaxed"
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
