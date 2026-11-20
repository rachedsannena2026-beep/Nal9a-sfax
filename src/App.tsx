import { useEffect, useMemo, useState } from 'react';
import { AddServiceSection } from './components/AddServiceSection';
import { CategoryIcon } from './components/CategoryIcon';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MonthlyStatsSection } from './components/MonthlyStatsSection';
import { PaymentSection } from './components/PaymentSection';
import { RequestsDrawer } from './components/RequestsDrawer';
import { ServiceCard } from './components/ServiceCard';
import { ServiceModal } from './components/ServiceModal';
import {
  CATEGORY_OPTIONS,
  INITIAL_SERVICES,
  SFAX_AREAS,
} from './data/services';
import {
  BookingRequest,
  ServiceCategory,
  ServiceItem,
  ServiceReview,
  SortOption,
} from './types/service';

const STORAGE_SERVICES_KEY = 'winnal9a_sfax_services_v1';
const STORAGE_REQUESTS_KEY = 'winnal9a_sfax_requests_v2';
const STORAGE_REVIEWS_KEY = 'winnal9a_sfax_reviews_v1';

export default function App() {
  const [customServices, setCustomServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SERVICES_KEY);
      return saved ? (JSON.parse(saved) as ServiceItem[]) : [];
    } catch {
      return [];
    }
  });

  const [requests, setRequests] = useState<BookingRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REQUESTS_KEY);
      return saved ? (JSON.parse(saved) as BookingRequest[]) : [];
    } catch {
      return [];
    }
  });

  const [userReviews, setUserReviews] = useState<
    Record<string, ServiceReview[]>
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REVIEWS_KEY);
      return saved
        ? (JSON.parse(saved) as Record<string, ServiceReview[]>)
        : {};
    } catch {
      return {};
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory>('all');
  const [selectedCity, setSelectedCity] = useState('كل مناطق صفاقس');
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_SERVICES_KEY,
        JSON.stringify(customServices)
      );
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [customServices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(requests));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(userReviews));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [userReviews]);

  const allServices = useMemo(() => {
    const baseList = [...customServices, ...INITIAL_SERVICES];
    return baseList.map((service) => {
      const added = userReviews[service.id];
      if (!added || added.length === 0) return service;

      const baseSum = service.rating * service.reviewCount;
      const addedSum = added.reduce((sum, r) => sum + r.rating, 0);
      const newCount = service.reviewCount + added.length;
      const newRating = Math.round(((baseSum + addedSum) / newCount) * 10) / 10;

      return {
        ...service,
        rating: newRating,
        reviewCount: newCount,
        reviews: [...added, ...service.reviews],
      };
    });
  }, [customServices, userReviews]);

  const activeService = useMemo(
    () => allServices.find((s) => s.id === activeServiceId) || null,
    [allServices, activeServiceId]
  );

  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matches = allServices.filter((service) => {
      const categoryMatch =
        selectedCategory === 'all' || service.category === selectedCategory;
      const cityMatch =
        selectedCity === 'كل مناطق صفاقس' || service.city === selectedCity;
      const queryMatch =
        query === '' ||
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.providerName.toLowerCase().includes(query) ||
        service.categoryLabel.toLowerCase().includes(query) ||
        service.city.toLowerCase().includes(query);

      return categoryMatch && cityMatch && queryMatch;
    });

    return [...matches].sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceFrom - b.priceFrom;
      if (sortBy === 'fast') return a.responseMinutes - b.responseMinutes;
      return b.rating - a.rating || b.reviewCount - a.reviewCount;
    });
  }, [allServices, searchQuery, selectedCategory, selectedCity, sortBy]);

  const handleScrollToDirectory = () => {
    document
      .getElementById('directory')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleJumpToAddService = () => {
    document
      .getElementById('add-service')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleJumpToPayment = () => {
    document
      .getElementById('payment')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCity('كل مناطق صفاقس');
    setSortBy('rating');
  };

  const handleCreateBooking = (booking: BookingRequest) => {
    setRequests((prev) => [booking, ...prev]);
  };

  const handleRemoveRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCompleteRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'تم إتمام الخدمة' } : r
      )
    );
  };

  const handleSubmitReview = ({
    requestId,
    rating,
    comment,
  }: {
    requestId: string;
    rating: number;
    comment: string;
  }) => {
    const targetRequest = requests.find((r) => r.id === requestId);
    if (!targetRequest || targetRequest.userRating) return;

    const todayLabel = new Date().toLocaleDateString('ar-TN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const newReview: ServiceReview = {
      id: `rev-${Date.now()}`,
      author: targetRequest.customerName,
      city: targetRequest.city,
      rating,
      comment:
        comment ||
        `تم تقييم الخدمة بـ ${rating} من 5 نجوم بعد إتمام الطلب بنجاح.`,
      date: todayLabel,
    };

    setUserReviews((prev) => ({
      ...prev,
      [targetRequest.serviceId]: [
        newReview,
        ...(prev[targetRequest.serviceId] || []),
      ],
    }));

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              userRating: rating,
              userReview: comment,
              reviewedAt: todayLabel,
            }
          : r
      )
    );
  };

  const handleAddService = (newService: ServiceItem) => {
    setCustomServices((prev) => [newService, ...prev]);
    setSelectedCategory('all');
    setSelectedCity('كل مناطق صفاقس');
    setSearchQuery('');
  };

  const handleSettlePayment = ({
    referenceCode,
    method,
  }: {
    referenceCode: string;
    method: 'd17' | 'card';
    amount: number;
    payerDetail: string;
  }) => {
    const paymentRef = `PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const methodLabel =
      method === 'd17' ? 'محفظة D17 أو Flouci' : 'بطاقة بنكية (CIB / Visa)';

    setRequests((prev) =>
      prev.map((req) =>
        req.referenceCode.toUpperCase() === referenceCode.toUpperCase()
          ? {
              ...req,
              paymentMethod: method,
              paymentMethodLabel: methodLabel,
              paymentStatus: 'تم الدفع إلكترونياً',
              paymentRef,
            }
          : req
      )
    );

    return paymentRef;
  };

  return (
    <div className="min-h-screen flex flex-col bg-marketplace-canvas text-slate-900 overflow-x-hidden">
      <Header
        requestsCount={requests.length}
        onOpenRequests={() => setIsRequestsOpen(true)}
        onJumpToAddService={handleJumpToAddService}
      />

      <main className="flex-1">
        <Hero
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedCity={selectedCity}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onCityChange={setSelectedCity}
          onSubmitSearch={handleScrollToDirectory}
          totalServicesCount={allServices.length}
        />

        {/* Directory & Filter Workspace */}
        <section
          id="directory"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#0F766E]">
                مقدمو خدمات معتمدون
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                دليل الخدمات المتاحة في صفاقس
              </h2>
              <p className="text-sm text-slate-600 tabular-nums">
                عرض {filteredServices.length} من أصل {allServices.length} خدمة
                موثوقة
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <span>المنطقة:</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 shadow-2xs focus:outline-none focus:border-[#0D9488] cursor-pointer"
                >
                  {SFAX_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-600">
                <span>ترتيب حسب:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 shadow-2xs focus:outline-none focus:border-[#0D9488] cursor-pointer"
                >
                  <option value="rating">الأعلى تقييماً</option>
                  <option value="price-asc">الأقل سعراً</option>
                  <option value="fast">الأسرع استجابة</option>
                </select>
              </label>
            </div>
          </div>

          {/* Interactive Category Filter Segmented Bar with Organized Uniform Icons */}
          <div
            id="categories"
            role="tablist"
            aria-label="تصنيفات الخدمات"
            className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2"
          >
            {CATEGORY_OPTIONS.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 min-h-[42px] text-sm font-medium rounded-xl border inline-flex items-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                    isActive
                      ? 'bg-[#0F2547] text-white border-[#0F2547] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:text-[#0F2547] shadow-2xs'
                  }`}
                >
                  <CategoryIcon
                    category={cat.id}
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#2DD4BF]' : 'text-[#0F766E]'
                    }`}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Services Grid */}
          {filteredServices.length === 0 ? (
            <div className="card-premium rounded-2xl p-12 text-center space-y-3">
              <p className="text-base font-semibold text-slate-900">
                لا توجد خدمات مطابقة لخيارات البحث الحالية
              </p>
              <p className="text-sm text-slate-500">
                جرّب تغيير الكلمات المفتاحية أو اختيار &laquo;كل مناطق صفاقس&raquo;
                لعرض المزيد من المزودين.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-5 py-2.5 min-h-[44px] bg-[#0F2547] hover:bg-[#173666] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                إعادة ضبط البحث
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={(item) => setActiveServiceId(item.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Frequently Asked Questions about Booking & Payments in Sfax */}
        <FaqSection />

        {/* Monthly Completed Requests Statistics (Recharts) */}
        <MonthlyStatsSection requests={requests} />

        {/* Dedicated Payment Hub & Quick Settlement Section */}
        <PaymentSection
          requests={requests}
          onSettlePayment={handleSettlePayment}
        />

        <AddServiceSection onAddService={handleAddService} />
      </main>

      <Footer />

      {activeService && (
        <ServiceModal
          service={activeService}
          onClose={() => setActiveServiceId(null)}
          onCreateBooking={handleCreateBooking}
          onOpenRequests={() => setIsRequestsOpen(true)}
        />
      )}

      <RequestsDrawer
        isOpen={isRequestsOpen}
        requests={requests}
        onClose={() => setIsRequestsOpen(false)}
        onRemoveRequest={handleRemoveRequest}
        onCompleteRequest={handleCompleteRequest}
        onSubmitReview={handleSubmitReview}
        onJumpToPayment={handleJumpToPayment}
      />
    </div>
  );
}
