import {
  Banknote,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  ShieldCheck,
  Smartphone,
  Star,
  X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { PAYMENT_METHOD_OPTIONS, SFAX_AREAS } from '../data/services';
import {
  BookingRequest,
  PaymentMethod,
  PaymentStatus,
  ServiceItem,
} from '../types/service';
import { CategoryIcon } from './CategoryIcon';

interface ServiceModalProps {
  service: ServiceItem;
  onClose: () => void;
  onCreateBooking: (booking: BookingRequest) => void;
  onOpenRequests: () => void;
}

export function ServiceModal({
  service,
  onClose,
  onCreateBooking,
  onOpenRequests,
}: ServiceModalProps) {
  const [imgError, setImgError] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [city, setCity] = useState(service.city || 'صفاقس المدينة');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [walletPhone, setWalletPhone] = useState('');
  const [cardLast4, setCardLast4] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedRequest, setConfirmedRequest] =
    useState<BookingRequest | null>(null);

  const renderPaymentIcon = (id: PaymentMethod) => {
    switch (id) {
      case 'cash':
        return <Banknote className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case 'd17':
        return <Smartphone className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case 'card':
        return <CreditCard className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case 'bank':
        return <Building2 className="w-4 h-4 shrink-0" aria-hidden="true" />;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = customerName.trim();
    const cleanedPhone = customerPhone.replace(/\s+/g, '');

    if (trimmedName.length < 3) {
      setErrorMsg('يرجى إدخال الاسم الكامل (3 أحرف على الأقل).');
      return;
    }

    if (!/^[+]?\d{8,13}$/.test(cleanedPhone)) {
      setErrorMsg('يرجى إدخال رقم هاتف صحيح (من 8 إلى 13 رقماً).');
      return;
    }

    if (!preferredDate) {
      setErrorMsg('يرجى تحديد التاريخ المفضل للخدمة.');
      return;
    }

    if (paymentMethod === 'd17') {
      const cleanedWallet = walletPhone.replace(/\s+/g, '');
      if (!/^\d{8}$/.test(cleanedWallet)) {
        setErrorMsg('يرجى إدخال رقم محفظة D17 / Flouci من 8 أرقام.');
        return;
      }
    }

    if (paymentMethod === 'card') {
      const cleanedCard = cardLast4.replace(/\s+/g, '');
      if (!/^\d{12,16}$/.test(cleanedCard)) {
        setErrorMsg('يرجى إدخال رقم البطاقة البنكية (من 12 إلى 16 رقماً).');
        return;
      }
    }

    const methodMeta = PAYMENT_METHOD_OPTIONS.find(
      (m) => m.id === paymentMethod
    );

    let paymentStatus: PaymentStatus = 'الدفع عند الإنجاز';
    let paymentRef: string | undefined;

    if (paymentMethod === 'd17' || paymentMethod === 'card') {
      paymentStatus = 'تم الدفع إلكترونياً';
      paymentRef = `PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    } else if (paymentMethod === 'bank') {
      paymentStatus = 'بانتظار التحويل';
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newBooking: BookingRequest = {
      id: `req-${Date.now()}`,
      referenceCode: `WN-${randomDigits}`,
      serviceId: service.id,
      serviceTitle: service.title,
      providerName: service.providerName,
      priceFrom: service.priceFrom,
      customerName: trimmedName,
      customerPhone: cleanedPhone,
      city,
      preferredDate,
      notes: notes.trim(),
      createdAt: new Date().toLocaleDateString('ar-TN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      status: 'قيد المراجعة',
      paymentMethod,
      paymentMethodLabel: methodMeta ? methodMeta.label : 'نقداً عند الإنجاز',
      paymentStatus,
      paymentRef,
    };

    onCreateBooking(newBooking);
    setConfirmedRequest(newBooking);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#091526]/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Top Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-5 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#0F766E]">
              <CategoryIcon
                category={service.category}
                className="w-3.5 h-3.5 shrink-0"
              />
              <span>{service.categoryLabel}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{service.city}</span>
            <span aria-hidden="true">·</span>
            <span>{service.providerName}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2-Column Details & Booking + Payment */}
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Right Column: Service Overview, Deliverables & Reviews */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              {!imgError ? (
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-500">
                  <CategoryIcon
                    category={service.category}
                    className="w-8 h-8"
                  />
                  <span className="text-sm font-medium">{service.title}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h2
                id="service-modal-title"
                className="text-2xl font-bold text-[#0F172A] leading-snug"
              >
                {service.title}
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
                  {service.verified && (
                    <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
                  )}
                  {service.providerName}
                </span>
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <strong className="text-slate-900">
                    {service.rating.toFixed(1)}
                  </strong>
                  <span className="text-slate-500">
                    ({service.reviewCount} تقييم)
                  </span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  الرد {service.responseTime}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {service.city}
                </span>
              </div>

              <p className="text-slate-600 leading-relaxed pt-1">
                {service.description}
              </p>
            </div>

            {/* Deliverables */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h3 className="text-base font-semibold text-[#0F172A]">
                ما يشمله العرض الأساسي
              </h3>
              <ul className="space-y-2.5">
                {service.deliverables.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Reviews */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h3 className="text-base font-semibold text-[#0F172A]">
                آراء العملاء السابقين
              </h3>
              {service.reviews.length === 0 ? (
                <p className="text-sm text-slate-500">
                  خدمة مضافة حديثاً — كن أول من يقيّم التجربة بعد الحجز.
                </p>
              ) : (
                <div className="space-y-3">
                  {service.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-slate-900">
                          {rev.author} · {rev.city}
                        </span>
                        <span>{rev.date}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Left Column: Contiguous Booking & Payment Form */}
          <div className="lg:col-span-5">
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-5 space-y-5 sticky top-20">
              <div className="pb-4 border-b border-slate-200 flex items-baseline justify-between gap-2">
                <div>
                  <span className="text-xs text-slate-500 block">
                    التسعير التقديري ابتداءً من
                  </span>
                  <span className="text-2xl font-bold text-[#0F172A] tabular-nums">
                    {service.priceFrom} {service.priceUnit}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#0F766E]">
                  {service.availability}
                </span>
              </div>

              {confirmedRequest ? (
                <div className="space-y-4 py-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#0D9488] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        تم تسجيل طلبك بنجاح
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        سيتواصل معك فريق{' '}
                        <strong className="text-slate-900">
                          {service.providerName}
                        </strong>{' '}
                        {service.responseTime} لتأكيد الموعد.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">رقم المرجع</span>
                      <span
                        dir="ltr"
                        className="font-mono-num font-semibold text-[#0F2547]"
                      >
                        #{confirmedRequest.referenceCode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">الموعد المفضل</span>
                      <span className="tabular-nums text-slate-900">
                        {confirmedRequest.preferredDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">المنطقة</span>
                      <span className="text-slate-900">
                        {confirmedRequest.city}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-100">
                      <span className="text-slate-500">طريقة الدفع</span>
                      <span className="font-medium text-slate-900">
                        {confirmedRequest.paymentMethodLabel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">حالة الدفع</span>
                      <span className="font-semibold text-[#0F766E]">
                        {confirmedRequest.paymentStatus}
                      </span>
                    </div>
                    {confirmedRequest.paymentRef && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">وصل الدفع</span>
                        <span
                          dir="ltr"
                          className="font-mono-num text-[#0F766E] font-semibold"
                        >
                          {confirmedRequest.paymentRef}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenRequests();
                      }}
                      className="flex-1 py-2.5 min-h-[44px] px-4 bg-[#0F2547] hover:bg-[#173666] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      عرض في طلباتي
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="py-2.5 min-h-[44px] px-4 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-[#0F172A]">
                    تفاصيل الحجز والدفع
                  </h3>

                  {errorMsg && (
                    <p
                      role="alert"
                      className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg p-3"
                    >
                      {errorMsg}
                    </p>
                  )}

                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-slate-700">
                      الاسم الكامل
                    </span>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثال: أحمد بن صالح"
                      className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#0D9488]"
                    />
                  </label>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-slate-700">
                      رقم الهاتف للتواصل
                    </span>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="20 123 456"
                      className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 text-right focus:outline-none focus:border-[#0D9488] tabular-nums"
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-medium text-slate-700">
                        المنطقة في صفاقس
                      </span>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-11 px-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#0D9488]"
                      >
                        {SFAX_AREAS.filter((a) => a !== 'كل مناطق صفاقس').map(
                          (a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          )
                        )}
                      </select>
                    </label>

                    <label className="block space-y-1.5">
                      <span className="text-xs font-medium text-slate-700">
                        الموعد المفضل
                      </span>
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full h-11 px-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#0D9488] tabular-nums"
                      />
                    </label>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-2 pt-1">
                    <span className="block text-xs font-semibold text-slate-800">
                      طريقة الدفع المفضلة
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {PAYMENT_METHOD_OPTIONS.map((opt) => {
                        const isSelected = paymentMethod === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setPaymentMethod(opt.id)}
                            className={`p-2.5 min-h-[44px] rounded-xl border text-right flex items-center gap-2 transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#0F2547] text-white border-[#0F2547]'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span
                              className={
                                isSelected ? 'text-[#2DD4BF]' : 'text-[#0F766E]'
                              }
                            >
                              {renderPaymentIcon(opt.id)}
                            </span>
                            <span className="text-xs font-medium leading-tight">
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {paymentMethod === 'd17' && (
                      <input
                        type="tel"
                        dir="ltr"
                        required
                        value={walletPhone}
                        onChange={(e) => setWalletPhone(e.target.value)}
                        placeholder="رقم محفظة D17 / Flouci (8 أرقام)"
                        className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 text-right tabular-nums focus:outline-none focus:border-[#0D9488]"
                      />
                    )}

                    {paymentMethod === 'card' && (
                      <input
                        type="text"
                        dir="ltr"
                        required
                        value={cardLast4}
                        onChange={(e) => setCardLast4(e.target.value)}
                        placeholder="رقم البطاقة (4532 8900 1234 5678)"
                        className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 text-right font-mono-num focus:outline-none focus:border-[#0D9488]"
                      />
                    )}

                    {paymentMethod === 'bank' && (
                      <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                        <span className="font-semibold text-slate-800 block">
                          بيانات التحويل البنكي (RIB صفاقس):
                        </span>
                        <span
                          dir="ltr"
                          className="font-mono-num text-slate-900 block text-right"
                        >
                          TN59 1000 6035 1234 5678 9012
                        </span>
                      </div>
                    )}
                  </div>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-slate-700">
                      ملاحظات إضافية (اختياري)
                    </span>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="اذكر تفاصيل إضافية مثل العنوان الدقيق أو نوع العطل..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#0D9488] resize-none"
                    />
                  </label>

                  <button
                    type="submit"
                    className="w-full py-3 min-h-[44px] px-4 bg-[#0F2547] hover:bg-[#173666] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D9488]"
                  >
                    {paymentMethod === 'd17' || paymentMethod === 'card'
                      ? `تأكيد الحجز والدفع (${service.priceFrom} د.ت)`
                      : 'تأكيد إرسال الطلب'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
