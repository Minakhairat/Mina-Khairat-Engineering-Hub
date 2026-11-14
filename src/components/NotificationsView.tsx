import React, { useState } from 'react';
import { ArrowUpLeft, Bell, BellRing, CheckCheck, ShieldAlert } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { NOTIFICATION_TYPE_LABELS } from '../types/platform';
import { canUseBrowserNotifications, requestNotificationPermission } from '../utils/device';

interface NotificationsViewProps {
  onOpenAuth: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onOpenAuth }) => {
  const {
    isVerified,
    notifications,
    readNotificationIds,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    userProfile,
    updateOwnProfile,
  } = usePlatform();

  const [permState, setPermState] = useState<string>(
    canUseBrowserNotifications() ? Notification.permission : 'unsupported'
  );

  const handleEnablePush = async () => {
    const res = await requestNotificationPermission();
    setPermState(res);
    if (res === 'granted' && userProfile) {
      await updateOwnProfile({
        displayName: userProfile.displayName,
        phone: userProfile.phone,
        jobTitle: userProfile.jobTitle,
        company: userProfile.company,
        notificationsEnabled: true,
      });
    }
  };

  if (!isVerified) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 text-center max-w-xl mx-auto my-8">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Bell className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          سجّل دخولك لاستقبال إشعارات المنصة
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          عند تسجيل الدخول ببريدك الإلكتروني، ستصلك تنبيهات فورية من المهندس مينا خيرت عند إضافة أدوات هندسية جديدة أو نشر تحديثات مهمة.
        </p>
        <button
          type="button"
          onClick={onOpenAuth}
          className="mt-6 min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer"
        >
          <span>تسجيل الدخول الآن</span>
        </button>
      </div>
    );
  }

  const activeNotifications = notifications.filter((n) => n.isActive);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header & Mark All Read */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            مركز الإشعارات والتنبيهات
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            الإعلانات والتحديثات المرسلة لجميع مستخدمي المنصة — غير مقروء:{' '}
            <span className="font-mono-nums font-bold text-blue-600 dark:text-blue-400">{unreadCount}</span>
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => void markAllNotificationsRead()}
            className="min-h-[42px] inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <CheckCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>تحديد الكل كمقروء</span>
          </button>
        )}
      </div>

      {/* Device Push Notification Permission Banner */}
      {permState !== 'granted' && permState !== 'unsupported' && (
        <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <BellRing className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                تفعيل إشعارات الجهاز الفورية (Windows / Android / iOS)
              </h3>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {permState === 'denied'
                  ? 'تم حظر الإشعارات من إعدادات المتصفح. يمكنك إعادة تفعيلها من أيقونة القفل بجانب رابط الموقع.'
                  : 'اسمح للمتصفح بعرض الإشعارات ليصلك تنبيه مباشر فور إرسال إعلان جديد من م. مينا خيرت.'}
              </p>
            </div>
          </div>
          {permState !== 'denied' && (
            <button
              type="button"
              onClick={() => void handleEnablePush()}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              تفعيل الإشعارات
            </button>
          )}
        </div>
      )}

      {/* Notifications List */}
      {activeNotifications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center">
          <Bell className="h-8 w-8 text-slate-400 mx-auto" />
          <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
            لا توجد إشعارات حالياً
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            ستظهر هنا جميع الإعلانات وإطلاقات التطبيقات الجديدة فور نشرها.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeNotifications.map((notif) => {
            const isRead = readNotificationIds.has(notif.id);
            const dateLabel = notif.createdAt?.toDate
              ? notif.createdAt.toDate().toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'الآن';

            return (
              <article
                key={notif.id}
                onClick={() => void markNotificationRead(notif.id)}
                className={`rounded-2xl border p-5 transition-colors cursor-pointer ${
                  isRead
                    ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    : 'border-blue-300 dark:border-blue-700 bg-blue-50/40 dark:bg-blue-950/25'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-blue-700 dark:text-blue-400">
                        {NOTIFICATION_TYPE_LABELS[notif.type]}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{notif.senderName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-nums">{dateLabel}</span>
                      {!isRead && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-bold text-rose-600 dark:text-rose-400">جديد</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {notif.type === 'urgent' && (
                        <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      )}
                      <span>{notif.title}</span>
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {notif.body}
                    </p>
                  </div>

                  {notif.targetAppUrl && (
                    <a
                      href={notif.targetAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        void markNotificationRead(notif.id);
                      }}
                      className="min-h-[40px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 self-start"
                    >
                      <span>{notif.targetAppTitle || 'فتح الرابط'}</span>
                      <ArrowUpLeft className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
