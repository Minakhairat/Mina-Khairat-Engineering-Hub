import React, { useMemo, useState } from 'react';
import {
  ArrowUpLeft,
  Check,
  Copy,
  Mail,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { OWNER_INFO } from '../data/defaultApps';
import heroIndustrialImg from '../assets/images/hero_industrial_hub_1794643096006.jpg';
import engineerEmblemImg from '../assets/images/engineer_emblem_1794643095985.jpg';
import { usePlatform } from '../context/PlatformContext';
import { CATEGORY_LABELS, type AppCategory, type AppItem } from '../types/platform';
import { AppIcon } from './AppIcon';
import { PWAInstallButton } from './PWAInstallButton';

interface AppsCatalogViewProps {
  onOpenAuth: () => void;
}

const FILTER_OPTIONS: { value: 'all' | AppCategory; label: string }[] = [
  { value: 'all', label: 'كل التطبيقات' },
  { value: 'lean', label: 'اللين وتدفق القيمة' },
  { value: 'quality', label: 'الجودة 5S' },
  { value: 'production', label: 'الإنتاج' },
  { value: 'training', label: 'التدريب والمهارات' },
  { value: 'ai', label: 'الذكاء الاصطناعي' },
];

export const AppsCatalogView: React.FC<AppsCatalogViewProps> = ({ onOpenAuth }) => {
  const { apps, appsLoading, isVerified, isAdmin, trackAppLaunch } = usePlatform();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | AppCategory>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [heroImgError, setHeroImgError] = useState(false);

  const visibleApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return apps
      .filter((a) => isAdmin || a.isActive)
      .filter((a) => categoryFilter === 'all' || a.category === categoryFilter)
      .filter((a) => {
        if (!q) return true;
        return (
          a.title.toLowerCase().includes(q) ||
          a.titleAr.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
        );
      });
  }, [apps, isAdmin, categoryFilter, searchQuery]);

  const handleCopyUrl = async (app: AppItem) => {
    try {
      await navigator.clipboard.writeText(app.url);
      setCopiedId(app.id);
      setTimeout(() => setCopiedId((prev) => (prev === app.id ? null : prev)), 2000);
    } catch {
      // Clipboard blocked in restricted context
    }
  };

  return (
    <div className="space-y-10 pb-8">
      {/* Executive Hero Split */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>{OWNER_INFO.nameAr}</span>
                <span aria-hidden="true">·</span>
                <span className="font-latin">{OWNER_INFO.nameEn}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-nums" dir="ltr">{OWNER_INFO.phone}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight [text-wrap:balance]">
                المنصة الموحدة لتطبيقات الهندسة الصناعية واللين سيجما
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {OWNER_INFO.specialtyAr}. بوابة مركزية تجمع كل أدوات التحليل والتدقيق وموازنة خطوط الإنتاج في مكان واحد متوافق مع الكمبيوتر والتابلت والموبايل (Windows · Android · iOS).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!isVerified ? (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>تسجيل الدخول بالبريد الإلكتروني</span>
                </button>
              ) : (
                <a
                  href="#apps-grid"
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>استعراض الأدوات الهندسية</span>
                </a>
              )}

              <PWAInstallButton />

              <a
                href={OWNER_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>تواصل واتساب</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full bg-slate-900 border-t lg:border-t-0 lg:border-r border-slate-200 dark:border-slate-800 overflow-hidden">
            {!heroImgError ? (
              <img
                src={heroIndustrialImg}
                alt="منظومة الهندسة الصناعية واللين سيجما — المهندس مينا خيرت"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgError(true)}
                className="w-full h-full object-cover lg:h-full"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white">
                <p className="font-latin text-lg font-bold tracking-tight">Lean Six Sigma Suite</p>
                <p className="mt-1 text-xs text-slate-300">{OWNER_INFO.nameAr}</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-xs text-white/90">
              <span className="font-semibold">أدوات متصلة بالسحابة عبر Firebase</span>
              <span className="font-mono-nums font-semibold">
                {apps.filter((a) => a.isActive).length} تطبيقات نشطة
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Category Filter Toolbar */}
      <section id="apps-grid" className="space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              دليل التطبيقات والأدوات الهندسية
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              اختر أي أداة للانتقال مباشرة إلى التطبيق وتشغيله على جهازك
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="h-4 w-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الأداة أو الوصف..."
              className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pr-10 pl-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Segmented Filter Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            {FILTER_OPTIONS.map((opt) => {
              const active = categoryFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCategoryFilter(opt.value)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Applications Grid */}
        {appsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 animate-pulse flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="h-3 w-4/5 rounded bg-slate-100 dark:bg-slate-800" />
                </div>
                <div className="h-11 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        ) : visibleApps.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center">
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              لا توجد تطبيقات مطابقة لنتيجة البحث
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              جرب مسح نص البحث أو اختيار تصنيف «كل التطبيقات».
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
              }}
              className="mt-4 min-h-[42px] px-4 py-2 rounded-xl bg-slate-900 dark:bg-blue-600 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
            >
              إعادة ضبط الفلترة
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleApps.map((app) => (
              <article
                key={app.id}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between gap-5 transition-colors hover:border-blue-300 dark:hover:border-blue-700"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <AppIcon
                        iconType={app.iconType}
                        iconName={app.iconName}
                        iconUrl={app.iconUrl}
                        accentColor={app.accentColor}
                        alt={app.title}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <span className="truncate">{CATEGORY_LABELS[app.category]}</span>
                          {!app.isActive && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">مخفي</span>
                            </>
                          )}
                        </div>
                        <h3 className="mt-0.5 text-base font-bold text-slate-900 dark:text-white leading-snug truncate font-latin">
                          {app.title}
                        </h3>
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 truncate">
                          {app.titleAr}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {app.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackAppLaunch(app)}
                    className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors whitespace-nowrap"
                  >
                    <span>فتح التطبيق</span>
                    <ArrowUpLeft className="h-4 w-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => void handleCopyUrl(app)}
                    title="نسخ رابط التطبيق"
                    aria-label={`نسخ رابط ${app.title}`}
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedId === app.id ? (
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Owner Identity & Direct Contact Footer Card */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={engineerEmblemImg}
              alt={OWNER_INFO.nameAr}
              referrerPolicy="no-referrer"
              className="h-14 w-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
            />
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                تصميم وتطوير وإشراف
              </p>
              <h3 className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
                {OWNER_INFO.nameAr} — <span className="font-latin font-semibold">{OWNER_INFO.nameEn}</span>
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                معاً نصنع الفرق — نحو كفاءة تشغيلية أعلى، جودة مستدامة، وابتكار هندسي مستمر.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={`tel:${OWNER_INFO.phone}`}
              className="min-h-[44px] inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
            >
              <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-mono-nums" dir="ltr">{OWNER_INFO.phone}</span>
            </a>

            <a
              href={OWNER_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors whitespace-nowrap"
            >
              <MessageCircle className="h-4 w-4" />
              <span>واتساب مباشر</span>
            </a>

            <a
              href={`mailto:${OWNER_INFO.email}`}
              className="min-h-[44px] inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              <Mail className="h-4 w-4 text-slate-500" />
              <span className="font-latin text-xs">{OWNER_INFO.email}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
