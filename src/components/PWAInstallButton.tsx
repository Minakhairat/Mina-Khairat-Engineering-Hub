import React, { useState } from 'react';
import { Download, Share, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          compact ? 'min-h-[40px] px-3 py-1.5 text-xs font-semibold' : 'min-h-[44px] px-4 py-2 text-sm font-semibold'
        }`}
      >
        <Download className="h-4 w-4" />
        <span>تثبيت التطبيق</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 min-h-[40px] text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>تثبيت على iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  تثبيت المنصة على iPhone / iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="إغلاق"
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ol className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="font-mono-nums font-bold text-blue-600 dark:text-blue-400">1.</span>
                  <span>
                    اضغط على زر المشاركة <Share className="inline h-4 w-4 mx-1 text-blue-600" /> في شريط متصفح Safari.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono-nums font-bold text-blue-600 dark:text-blue-400">2.</span>
                  <span>مرر للأسفل واختر «إضافة إلى الشاشة الرئيسية» (Add to Home Screen).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono-nums font-bold text-blue-600 dark:text-blue-400">3.</span>
                  <span>اضغط «إضافة» لتشغيل المنصة كتطبيق مستقل وتلقي الإشعارات.</span>
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full min-h-[44px] rounded-xl bg-slate-900 dark:bg-blue-600 text-white text-sm font-semibold hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors cursor-pointer"
              >
                فهمت
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
