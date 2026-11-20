import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { BookingRequest } from '../types/service';

interface RequestsDrawerProps {
  isOpen: boolean;
  requests: BookingRequest[];
  onClose: () => void;
  onRemoveRequest: (id: string) => void;
  onCompleteRequest: (id: string) => void;
  onSubmitReview: (payload: {
    requestId: string;
    rating: number;
    comment: string;
  }) => void;
  onJumpToPayment: () => void;
}

interface RatingFormProps {
  requestId: string;
  onSubmitReview: (payload: {
    requestId: string;
    rating: number;
    comment: string;
  }) => void;
}

function RequestRatingForm({ requestId, onSubmitReview }: RatingFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const activeStars = hoverRating || rating;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (rating < 1 || rating > 5) {
      setErrorMsg('يرجى اختيار عدد النجوم من 1 إلى 5.');
      return;
    }

    onSubmitReview({
      requestId,
      rating,
      comment: comment.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 pt-3 border-t border-slate-200 space-y-3"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#0F172A]">
          قيّم الخدمة بعد إتمامها
        </span>
        <span className="text-xs font-bold text-[#0F766E] tabular-nums">
          {activeStars} / 5
        </span>
      </div>

      <div
        className="flex items-center gap-1.5"
        role="radiogroup"
        aria-label="اختيار التقييم بالنجوم"
      >
        {[1, 2, 3, 4, 5].map((starValue) => {
          const filled = starValue <= activeStars;
          return (
            <button
              key={starValue}
              type="button"
              role="radio"
              aria-checked={rating === starValue}
              aria-label={`${starValue} نجوم`}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <Star
                className={`w-5 h-5 transition-colors ${
                  filled
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-slate-300 fill-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>

      {errorMsg && (
        <p role="alert" className="text-xs text-red-700 font-medium">
          {errorMsg}
        </p>
      )}

      <textarea
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="شارك رأيك باختصار حول جودة الخدمة والالتزام بالمواعيد (اختياري)..."
        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0D9488] resize-none"
      />

      <button
        type="submit"
        className="w-full py-2 min-h-[40px] px-3 bg-[#0F2547] hover:bg-[#173666] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
      >
        إرسال التقييم
      </button>
    </form>
  );
}

export function RequestsDrawer({
  isOpen,
  requests,
  onClose,
  onRemoveRequest,
  onCompleteRequest,
  onSubmitReview,
  onJumpToPayment,
}: RequestsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#091526]/60 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="سجل طلباتي"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-md h-full border-r border-slate-200 flex flex-col justify-between shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">طلباتي المحجوزة</h2>
            <p className="text-xs text-slate-500 tabular-nums">
              {requests.length === 0
                ? 'لا توجد طلبات مسجلة حالياً'
                : `${requests.length} طلبات مسجلة`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق قائمة الطلبات"
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-sm font-medium text-slate-800">
                لم تقم بحجز أي خدمة بعد
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                اختر أي خدمة من الدليل وأرسل طلب الحجز ليظهر هنا مع رقمه المرجعي
                وحالة التنفيذ والتقييم.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-5 py-2.5 min-h-[42px] bg-[#0F2547] text-white text-xs font-semibold rounded-xl hover:bg-[#173666] transition-colors cursor-pointer"
              >
                تصفح الخدمات
              </button>
            </div>
          ) : (
            requests.map((req) => {
              const isCompleted = req.status === 'تم إتمام الخدمة';
              return (
                <div
                  key={req.id}
                  className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          dir="ltr"
                          className="font-mono-num font-semibold text-[#0F766E]"
                        >
                          #{req.referenceCode}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">
                          ·
                        </span>
                        <span
                          className={`font-semibold ${
                            isCompleted ? 'text-[#0F766E]' : 'text-slate-600'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#0F172A]">
                        {req.serviceTitle}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {req.providerName} · {req.city}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveRequest(req.id)}
                      aria-label="إلغاء الطلب"
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {req.preferredDate}
                      </span>
                      <span className="font-semibold text-[#0F172A] tabular-nums">
                        {req.priceFrom} د.ت
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        {req.paymentMethodLabel}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          req.paymentStatus === 'تم الدفع إلكترونياً'
                            ? 'text-[#0F766E]'
                            : 'text-[#0F2547]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {req.paymentStatus}
                      </span>
                    </div>

                    {/* Action buttons before completion / payment */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      {req.paymentStatus !== 'تم الدفع إلكترونياً' && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onJumpToPayment();
                          }}
                          className="flex-1 py-2 min-h-[40px] px-3 bg-white border border-slate-200 hover:border-[#0D9488] hover:text-[#0F766E] text-[#0F2547] font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          دفع إلكتروني الآن
                        </button>
                      )}

                      {!isCompleted && (
                        <button
                          type="button"
                          onClick={() => onCompleteRequest(req.id)}
                          className="flex-1 py-2 min-h-[40px] px-3 bg-[#0F766E] hover:bg-[#0D9488] text-white font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          تأكيد إتمام الخدمة
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Rating Form after completion, or Submitted Review display */}
                  {isCompleted && !req.userRating && (
                    <RequestRatingForm
                      requestId={req.id}
                      onSubmitReview={onSubmitReview}
                    />
                  )}

                  {isCompleted && req.userRating && (
                    <div className="mt-3 pt-3 border-t border-slate-200 bg-white rounded-xl p-3 border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#0F766E]">
                          تقييمك المسجل
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= (req.userRating || 0)
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {req.userReview && (
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {req.userReview}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-[#F8FAFC]">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 min-h-[44px] bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            متابعة التصفح
          </button>
        </div>
      </div>
    </div>
  );
}
