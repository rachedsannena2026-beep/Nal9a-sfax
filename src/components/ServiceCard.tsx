import { Clock, ShieldCheck, Star } from 'lucide-react';
import { useState } from 'react';
import { ServiceItem } from '../types/service';
import { CategoryIcon } from './CategoryIcon';

interface ServiceCardProps {
  service: ServiceItem;
  onSelect: (service: ServiceItem) => void;
}

export function ServiceCard({ service, onSelect }: ServiceCardProps) {
  const [imgError, setImgError] = useState(false);
  const roundedStars = Math.round(service.rating);

  return (
    <article className="group card-premium rounded-2xl overflow-hidden flex flex-col justify-between hover:-translate-y-0.5">
      <div>
        {/* 4:3 Media Header */}
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden border-b border-slate-100">
          {!imgError ? (
            <img
              src={service.imageUrl}
              alt={service.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-teal-50/40 flex flex-col items-center justify-center p-4 text-center gap-2">
              <CategoryIcon
                category={service.category}
                className="w-8 h-8 text-[#0F2547]"
              />
              <span className="text-xs font-medium text-slate-600">
                {service.categoryLabel}
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-3">
          {/* Unboxed Metadata Kicker (Zero-Pill Rule) */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500">
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
            <span>{service.availability}</span>
          </div>

          <h3 className="text-lg font-bold text-[#0F172A] leading-snug">
            <button
              type="button"
              onClick={() => onSelect(service)}
              className="text-right hover:text-[#0F766E] transition-colors cursor-pointer focus-visible:outline-none focus-visible:underline"
            >
              {service.title}
            </button>
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>
      </div>

      {/* Footer Info, Average Rating & Action */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-4 border-t border-slate-100 space-y-4">
        <div className="flex items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 min-w-0">
            {service.verified && (
              <ShieldCheck
                className="w-4 h-4 text-[#0D9488] shrink-0"
                aria-label="مزود موثق"
              />
            )}
            <span className="truncate font-medium text-slate-800">
              {service.providerName}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-slate-500 shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>{service.responseTime}</span>
          </span>
        </div>

        {/* Dedicated Average Rating Row */}
        <div className="flex items-center justify-between gap-2 py-2 px-3 rounded-xl bg-[#F8FAFC] border border-slate-200/70">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-0.5"
              aria-label={`متوسط التقييم ${service.rating.toFixed(1)} من 5`}
            >
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <Star
                  key={starIndex}
                  className={`w-3.5 h-3.5 ${
                    starIndex <= roundedStars
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-slate-300'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-xs font-bold text-[#0F172A] tabular-nums">
              {service.rating.toFixed(1)}
            </span>
          </div>

          <span className="text-xs text-slate-500 tabular-nums">
            متوسط التقييم ({service.reviewCount})
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="tabular-nums">
            <span className="block text-xs text-slate-500">ابتداءً من</span>
            <span className="text-base font-bold text-[#0F172A]">
              {service.priceFrom} {service.priceUnit}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelect(service)}
            className="px-4 py-2.5 min-h-[42px] text-sm font-semibold text-[#0F2547] bg-slate-100 hover:bg-[#0F2547] hover:text-white rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            التفاصيل والحجز
          </button>
        </div>
      </div>
    </article>
  );
}
