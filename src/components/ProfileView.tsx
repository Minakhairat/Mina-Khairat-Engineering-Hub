import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Laptop,
  LogOut,
  Moon,
  Save,
  ShieldCheck,
  Sun,
  User,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { SCHEMA_LIMITS } from '../types/platform';
import { detectPlatformInfo, requestNotificationPermission } from '../utils/device';
import { PWAInstallButton } from './PWAInstallButton';

interface ProfileViewProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenAuth: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  theme,
  onToggleTheme,
  onOpenAuth,
}) => {
  const { user, userProfile, isVerified, isAdmin, updateOwnProfile, signOutUser } = usePlatform();

  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setPhone(userProfile.phone || '');
      setJobTitle(userProfile.jobTitle || '');
      setCompany(userProfile.company || '');
      setNotificationsEnabled(Boolean(userProfile.notificationsEnabled));
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedOk(false);
    if (notificationsEnabled) {
      await requestNotificationPermission();
    }
    await updateOwnProfile({
      displayName,
      phone,
      jobTitle,
      company,
      notificationsEnabled,
    });
    setSaving(false);
    setSavedOk(true);
    setTimeout(() => setSavedOk(false), 3000);
  };

  if (!isVerified || !user) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 text-center max-w-xl mx-auto my-8 space-y-5">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            حساب المستخدم والإعدادات
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            سجّل دخولك بالبريد الإلكتروني لحفظ بياناتك المهنية وتفعيل إشعارات المنصة على أجهزتك.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onOpenAuth}
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors cursor-pointer"
          >
            تسجيل الدخول بالبريد الإلكتروني
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
          </button>

          <PWAInstallButton />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            الملف الشخصي وإعدادات الجهاز
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            إدارة بياناتك الخاصة وتفضيلات التنبيهات والمظهر
          </p>
        </div>

        <button
          type="button"
          onClick={() => void signOutUser()}
          className="min-h-[42px] inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 dark:border-rose-800/70 bg-rose-50 dark:bg-rose-950/30 px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors cursor-pointer self-start"
        >
          <LogOut className="h-4 w-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>

      {/* Account Overview */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName || user.email || 'User'}
              referrerPolicy="no-referrer"
              className="h-14 w-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
            />
          ) : (
            <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <User className="h-6 w-6" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{isAdmin ? 'مدير المنصة' : 'مستخدم موثق'}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-nums">{detectPlatformInfo()}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {userProfile?.displayName || user.displayName || 'مستخدم'}
            </h2>
            <p className="text-xs font-latin text-slate-500 dark:text-slate-400 truncate" dir="ltr">
              {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">مرات تشغيل الأدوات</p>
            <p className="text-xl font-bold font-mono-nums text-slate-900 dark:text-white">
              {userProfile?.totalLaunches ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            البيانات المهنية والتواصل
          </h3>
          <span className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" />
            <span>سرية تامة</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              الاسم الكامل
            </label>
            <input
              type="text"
              required
              maxLength={SCHEMA_LIMITS.USER_NAME_MAX}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              رقم الهاتف (اختياري)
            </label>
            <input
              type="tel"
              dir="ltr"
              maxLength={SCHEMA_LIMITS.USER_PHONE_MAX}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              المسمى الوظيفي (اختياري)
            </label>
            <input
              type="text"
              maxLength={SCHEMA_LIMITS.USER_JOB_MAX}
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="مثال: مهندس جودة / مدير إنتاج"
              className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              الشركة أو المصنع (اختياري)
            </label>
            <input
              type="text"
              maxLength={SCHEMA_LIMITS.USER_COMPANY_MAX}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="اسم المنشأة"
              className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 cursor-pointer">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              تفعيل إشعارات المتصفح والجهاز
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              استلام تنبيه فوري عند إضافة أدوات جديدة أو إعلانات من المهندس مينا خيرت
            </p>
          </div>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            className="h-5 w-5 accent-blue-600 rounded cursor-pointer"
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
          </button>

          {savedOk && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>تم تحديث بياناتك بنجاح</span>
            </span>
          )}
        </div>
      </form>

      {/* Appearance & Cross-Device Install */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Laptop className="h-5 w-5 text-slate-500 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              المظهر وتثبيت التطبيق على جهازك
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              يدعم التشغيل كتطبيق مستقل على Windows و Android و iOS
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleTheme}
            className="min-h-[42px] inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
            <span>{theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
          </button>
          <PWAInstallButton compact />
        </div>
      </div>
    </div>
  );
};
