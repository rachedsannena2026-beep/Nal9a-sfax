import {
  Banknote,
  Building2,
  CheckCircle2,
  CreditCard,
  Lock,
  Smartphone,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { BookingRequest } from '../types/service';

interface PaymentSectionProps {
  requests: BookingRequest[];
  onSettlePayment: (payload: {
    referenceCode: string;
    method: 'd17' | 'card';
    amount: number;
    payerDetail: string;
  }) => string;
}

export function PaymentSection({
  requests,
  onSettlePayment,
}: PaymentSectionProps) {
  const unpaidRequests = requests.filter(
    (r) => r.paymentStatus !== 'تم الدفع إلكترونياً'
  );

  const [selectedRef, setSelectedRef] = useState('');
  const [manualRef, setManualRef] = useState('');
  const [amount, setAmount] = useState('45');
  const [method, setMethod] = useState<'d17' | 'card'>('d17');
  const [walletPhone, setWalletPhone] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [receipt, setReceipt] = useState<{
    paymentRef: string;
    bookingRef: string;
    amount: number;
    methodLabel: string;
  } | null>(null);

  const handleSelectRequest = (refCode: string) => {
    setSelectedRef(refCode);
    const found = unpaidRequests.find((r) => r.referenceCode === refCode);
    if (found) {
      setManualRef(found.referenceCode);
      setAmount(String(found.priceFrom));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetRef = (selectedRef || manualRef).trim().replace(/^#/, '');
    const parsedAmount = Number(amount);

    if (targetRef.length < 4) {
      setErrorMsg('يرجى إدخال رقم المرجع أو اختيار حجز من القائمة.');
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('يرجى إدخال مبلغ صحيح أكبر من صفر.');
      return;
    }

    if (method === 'd17') {
      const cleaned = walletPhone.replace(/\s+/g, '');
      if (!/^\d{8}$/.test(cleaned)) {
        setErrorMsg('يرجى إدخال رقم هاتف محفظة D17 / Flouci من 8 أرقام.');
        return;
      }
    } else {
      const cleanedCard = cardNumber.replace(/\s+/g, '');
      if (cardHolder.trim().length < 3 || !/^\d{12,16}$/.test(cleanedCard)) {
        setErrorMsg('يرجى إدخال اسم صاحب البطاقة ورقم البطاقة (12–16 رقماً).');
        return;
      }
    }

    const payerDetail =
      method === 'd17'
        ? walletPhone.trim()
        : `•••• ${cardNumber.replace(/\s+/g, '').slice(-4)}`;

    const paymentRef = onSettlePayment({
      referenceCode: targetRef,
      method,
      amount: parsedAmount,
      payerDetail,
    });

    setReceipt({
      paymentRef,
      bookingRef: targetRef,
      amount: parsedAmount,
      methodLabel:
        method === 'd17' ? 'محفظة D17 / Flouci' : 'بطاقة بنكية (CIB / Visa)',
    });

    setWalletPhone('');
    setCardHolder('');
    setCardNumber('');
    setSelectedRef('');
    setManualRef('');
  };

  return (
    <section
      id="payment"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-[#091526] via-[#0F2547] to-[#113356] bg-navy-mesh text-white rounded-3xl border border-[#1E3A5F]/60 shadow-[0_20px_50px_-12px_rgba(15,37,71,0.28)] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Soft Ambient Turquoise & Deep Blue Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#14B8A6]/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-[#1D4ED8]/15 blur-3xl"
        />

        {/* Right/Start: Payment Options & Guarantees */}
        <div className="relative z-10 lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#2DD4BF] tracking-wide">
              الدفع والمعاملات المالية
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
              خيارات دفع مرنة وآمنة لخدمات ولاية صفاقس
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              سواء كنت تفضل الدفع النقدي المباشر عند إتمام الخدمة أو التسوية
              الإلكترونية السريعة، نوفر لك وسائل الدفع المعتمدة في تونس دون أي
              عمولة إضافية على العميل.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10 space-y-2.5 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-lg bg-[#0F2547] border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF]">
                <Banknote className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                نقداً عند الإنجاز
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                ادفع مباشرة للحرفي أو المزود بعد معاينة العمل والتأكد من الجودة.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10 space-y-2.5 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-lg bg-[#0F2547] border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF]">
                <Smartphone className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                محفظة D17 و Flouci
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                دفع فوري عبر الهاتف الجوال مع إشعار تأكيد مباشر لرقم الحجز.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10 space-y-2.5 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-lg bg-[#0F2547] border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF]">
                <CreditCard className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                البطاقات البنكية التونسية
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                دعم كامل لبطاقات CIB وVisa وMastercard لتسوية المستحقات بأمان.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10 space-y-2.5 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-lg bg-[#0F2547] border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF]">
                <Building2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                تحويل بنكي للمؤسسات
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                خيار التحويل عبر RIB للمشاريع والشركات مع وصل وفاتورة نظامية.
              </p>
            </div>
          </div>
        </div>

        {/* Left/End: Interactive Quick Payment Settlement Box */}
        <div className="relative z-10 lg:col-span-6 bg-white text-slate-900 rounded-2xl border border-slate-200/90 shadow-lg p-6 space-y-5">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                بوابة الدفع السريع لحجوزاتك
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                سدد قيمة أي خدمة محجوزة أو فاتورة متفق عليها برقم المرجع
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] border border-slate-200 flex items-center justify-center text-[#0F766E] shrink-0">
              <Lock className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          {receipt ? (
            <div className="py-3 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#0D9488] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    تم تأكيد الدفع بنجاح
                  </h4>
                  <p className="text-sm text-slate-600 mt-0.5">
                    تم تسجيل المعاملة وتحديث حالة الحجز المرتبط بها.
                  </p>
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">رقم وصل الدفع</span>
                  <span
                    dir="ltr"
                    className="font-mono-num font-semibold text-[#0F766E]"
                  >
                    {receipt.paymentRef}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">مرجع الحجز</span>
                  <span dir="ltr" className="font-mono-num text-slate-900">
                    #{receipt.bookingRef}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">طريقة الدفع</span>
                  <span className="text-slate-900">{receipt.methodLabel}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="font-semibold text-slate-900">
                    المبلغ المدفوع
                  </span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {receipt.amount} د.ت
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setReceipt(null)}
                className="w-full py-2.5 min-h-[44px] px-4 bg-[#0F2547] hover:bg-[#173666] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                إجراء عملية دفع أخرى
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <p
                  role="alert"
                  className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  {errorMsg}
                </p>
              )}

              {unpaidRequests.length > 0 && (
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-slate-700">
                    اختر من طلباتك غير المدفوعة (اختياري)
                  </span>
                  <select
                    value={selectedRef}
                    onChange={(e) => handleSelectRequest(e.target.value)}
                    className="w-full h-11 px-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-[#0D9488]"
                  >
                    <option value="">-- أدخل رقم المرجع يدوياً --</option>
                    {unpaidRequests.map((req) => (
                      <option key={req.id} value={req.referenceCode}>
                        #{req.referenceCode} — {req.serviceTitle} (
                        {req.priceFrom} د.ت)
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-slate-700">
                    مرجع الحجز
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    value={manualRef}
                    onChange={(e) => {
                      setManualRef(e.target.value);
                      setSelectedRef('');
                    }}
                    placeholder="WN-4820"
                    className="w-full h-11 px-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-900 text-right font-mono-num focus:bg-white focus:outline-none focus:border-[#0D9488]"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-slate-700">
                    المبلغ (د.ت)
                  </span>
                  <input
                    type="number"
                    min={1}
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-11 px-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-900 tabular-nums focus:bg-white focus:outline-none focus:border-[#0D9488]"
                  />
                </label>
              </div>

              {/* Segmented Electronic Method Switch */}
              <div className="space-y-1.5">
                <span className="block text-xs font-medium text-slate-700">
                  وسيلة الدفع الإلكتروني
                </span>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMethod('d17')}
                    className={`py-2.5 px-3 min-h-[40px] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                      method === 'd17'
                        ? 'bg-white text-[#0F2547] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
                    <span>D17 / Flouci</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`py-2.5 px-3 min-h-[40px] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                      method === 'card'
                        ? 'bg-white text-[#0F2547] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
                    <span>بطاقة بنكية</span>
                  </button>
                </div>
              </div>

              {method === 'd17' ? (
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-slate-700">
                    رقم الهاتف المرتبط بمحفظة D17 / Flouci
                  </span>
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={walletPhone}
                    onChange={(e) => setWalletPhone(e.target.value)}
                    placeholder="20 123 456"
                    className="w-full h-11 px-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-900 text-right tabular-nums focus:bg-white focus:outline-none focus:border-[#0D9488]"
                  />
                </label>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-slate-700">
                      اسم حامل البطاقة
                    </span>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="الاسم كما على البطاقة"
                      className="w-full h-11 px-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#0D9488]"
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-slate-700">
                      رقم البطاقة البنكية
                    </span>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 8900 1234 5678"
                      className="w-full h-11 px-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-900 text-right font-mono-num focus:bg-white focus:outline-none focus:border-[#0D9488]"
                    />
                  </label>
                </div>
              )}

              <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                <span>عمولة المنصة على العميل: 0 د.ت</span>
                <span className="font-semibold text-[#0F172A] tabular-nums">
                  الإجمالي: {Number(amount) > 0 ? amount : 0} د.ت
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 min-h-[44px] px-4 bg-[#0F2547] hover:bg-[#173666] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D9488]"
              >
                تأكيد الدفع الإلكتروني
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
