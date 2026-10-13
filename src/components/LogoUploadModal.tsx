import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Image,
  Upload,
  X,
  CheckCircle2,
  Trash2,
  Sparkles,
  FileCheck,
  Receipt,
  FileSpreadsheet,
  Award,
  PenTool,
  Check
} from 'lucide-react';

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Crisp SVG preset emblems for Bangladeshi primary & kindergarten schools
const LOGO_PRESETS = [
  {
    id: 'shapla_green',
    name: 'শাপলা ও উদীয়মান সূর্য (সরকারি স্টাইল)',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%23047857" stroke="%23f59e0b" stroke-width="4"/><circle cx="50" cy="50" r="38" fill="%23ffffff"/><circle cx="50" cy="40" r="14" fill="%23f59e0b"/><path d="M50 32 Q54 44 50 56 Q46 44 50 32 Z" fill="%23047857"/><path d="M42 42 Q50 48 58 42 Q50 54 42 42 Z" fill="%2310b981"/><path d="M30 65 Q50 58 70 65 L66 70 Q50 64 34 70 Z" fill="%23047857"/><circle cx="50" cy="50" r="4" fill="%23dc2626"/></svg>',
  },
  {
    id: 'book_torch',
    name: 'মুক্ত বই ও জ্ঞানের মশাল',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%231e3a8a" stroke="%2338bdf8" stroke-width="4"/><circle cx="50" cy="50" r="38" fill="%23ffffff"/><path d="M26 62 Q50 54 50 68 Q50 54 74 62 L74 46 Q50 38 50 52 Q50 38 26 46 Z" fill="%230284c7" stroke="%230369a1" stroke-width="2"/><line x1="50" y1="52" x2="50" y2="68" stroke="%23ffffff" stroke-width="2"/><path d="M50 24 Q54 34 50 40 Q46 34 50 24 Z" fill="%23ef4444"/><polygon points="48,40 52,40 53,48 47,48" fill="%23f59e0b"/><circle cx="50" cy="28" r="3" fill="%23fef08a"/></svg>',
  },
  {
    id: 'kg_star',
    name: 'কেজি ও মডেল একাডেমি গোল্ডেন স্টার',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%237c3aed" stroke="%23fbbf24" stroke-width="4"/><circle cx="50" cy="50" r="38" fill="%23ffffff"/><polygon points="50,22 58,38 76,40 62,52 66,70 50,60 34,70 38,52 24,40 42,38" fill="%23f59e0b" stroke="%23b45309" stroke-width="2"/><circle cx="50" cy="48" r="10" fill="%23ffffff"/><text x="50" y="52" font-size="11" font-weight="bold" fill="%237c3aed" text-anchor="middle" font-family="sans-serif">★</text></svg>',
  },
  {
    id: 'bangladesh_dpe',
    name: 'প্রাথমিক শিক্ষা অধিদপ্তর নীল-সবুজ ক্রেস্ট',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%230f766e" stroke="%23e2e8f0" stroke-width="3"/><circle cx="50" cy="50" r="39" fill="%23ffffff"/><path d="M25 64 Q50 56 75 64 Q50 72 25 64 Z" fill="%230f766e"/><circle cx="50" cy="40" r="15" fill="%23dc2626"/><path d="M45 42 Q50 32 55 42 Q50 52 45 42 Z" fill="%23ffffff"/><path d="M36 46 Q50 40 64 46" stroke="%2310b981" stroke-width="3" fill="none"/></svg>',
  },
  {
    id: 'sun_growth',
    name: 'শিশু কানন ও সবুজ পল্লব',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%2315803d" stroke="%2386efac" stroke-width="3"/><circle cx="50" cy="50" r="38" fill="%23f0fdf4"/><path d="M30 68 Q45 48 50 32 Q55 48 70 68 Z" fill="%2322c55e"/><circle cx="50" cy="30" r="10" fill="%23eab308"/><path d="M40 50 Q50 42 60 50 Q50 58 40 50 Z" fill="%23ffffff"/></svg>',
  },
  {
    id: 'classic_shield',
    name: 'ঐতিহ্যবাহী স্কুল শিল্ড ও কলম',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M22 24 L78 24 L78 54 Q78 80 50 90 Q22 80 22 54 Z" fill="%23b91c1c" stroke="%23facc15" stroke-width="4"/><path d="M30 30 L70 30 L70 52 Q70 72 50 80 Q30 72 30 52 Z" fill="%23ffffff"/><line x1="50" y1="36" x2="50" y2="70" stroke="%23b91c1c" stroke-width="3"/><polygon points="47,38 53,38 50,30" fill="%23f59e0b"/><circle cx="50" cy="52" r="8" fill="%231d4ed8"/></svg>',
  },
];

export const LogoUploadModal: React.FC<LogoUploadModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useApp();
  const [logoPreview, setLogoPreview] = useState<string>(settings.logoUrl || '');
  const [signaturePreview, setSignaturePreview] = useState<string>(settings.signatureUrl || '');
  const [successMsg, setSuccessMsg] = useState('');
  const [previewTab, setPreviewTab] = useState<'receipt' | 'admit' | 'cert'>('receipt');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('ছবির আকার সর্বোচ্চ ৫ মেগাবাইট হতে পারে!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setLogoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSignaturePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateSettings({
      logoUrl: logoPreview,
      signatureUrl: signaturePreview,
    });
    setSuccessMsg('বিদ্যালয়ের লোগো ও ডিজিটাল স্বাক্ষর সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleRemoveLogo = () => {
    setLogoPreview('');
  };

  const handleRemoveSignature = () => {
    setSignaturePreview('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                বিদ্যালয় লোগো ও স্বাক্ষর ব্যবস্থাপনা
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                লোগো আপলোড করুন বা অফিশিয়াল প্রিসেট থেকে নির্বাচন করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Upload & Presets (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Custom File Upload Box */}
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/10 text-center">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-white dark:bg-slate-800 shadow-md border-2 border-emerald-500 flex items-center justify-center overflow-hidden mb-3">
                {logoPreview ? (
                  <img src={logoPreview} alt="School Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-4xl">🏫</span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all">
                  <Upload className="w-4 h-4" />
                  <span>কম্পিউটার/মোবাইল থেকে আপলোড</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {logoPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 text-xs font-bold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছুন</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                সমর্থিত ফাইল: PNG, JPG, JPEG, SVG, WebP (স্বচ্ছ বা সাদা ব্যাকগ্রাউন্ড সেরা)
              </p>
            </div>

            {/* Preset School Badges */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>রেডিমেড অফিশিয়াল লোগো প্রিসেট (এক ক্লিকে সেট করুন):</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {LOGO_PRESETS.map((preset) => {
                  const isSelected = logoPreview === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setLogoPreview(preset.url)}
                      className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center p-0.5 shrink-0">
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                          {preset.name}
                        </p>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          {isSelected ? '✓ নির্বাচিত' : 'ক্লিক করুন'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Principal Signature Upload */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-purple-600" />
                <span>প্রধান শিক্ষকের ডিজিটাল স্বাক্ষর (রসিদ ও সনদে স্বয়ংক্রিয় প্রিন্ট হবে):</span>
              </h3>

              <div className="flex items-center gap-3">
                <div className="w-32 h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white flex items-center justify-center overflow-hidden p-1">
                  {signaturePreview ? (
                    <img src={signaturePreview} alt="Signature" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="font-signature italic text-slate-500 font-bold text-xs">
                      {settings.headTeacherName || 'Motiur'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors">
                    <span>স্বাক্ষর আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureUpload}
                      className="hidden"
                    />
                  </label>
                  {signaturePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveSignature}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold"
                    >
                      মুছুন
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Output Preview (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  লাইভ প্রিভিউ (কোথায় কেমন দেখাবে):
                </h3>
              </div>

              {/* Preview Format Tabs */}
              <div className="flex rounded-xl bg-slate-200/70 dark:bg-slate-700/60 p-1 mb-4 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setPreviewTab('receipt')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    previewTab === 'receipt' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  দ্বিকপি রসিদ
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('admit')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    previewTab === 'admit' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  প্রবেশপত্র (A4)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('cert')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    previewTab === 'cert' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  প্রশংসাপত্র
                </button>
              </div>

              {/* Live Preview Paper Box */}
              <div className="bg-white rounded-xl p-3.5 shadow-md border border-slate-200 text-slate-800 text-[10px] space-y-2.5">
                {/* Paper Header */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-300 flex items-center justify-center overflow-hidden shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-0.5" />
                    ) : (
                      <span>🏫</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="font-extrabold text-xs text-slate-900 truncate">{settings.name}</p>
                    <p className="text-[9px] text-slate-500 truncate">{settings.address} • {settings.code}</p>
                  </div>
                </div>

                {/* Body Content based on previewTab */}
                {previewTab === 'receipt' && (
                  <div className="space-y-1 text-slate-600">
                    <div className="text-center font-bold text-[10px] text-emerald-800 bg-emerald-50 py-0.5 rounded">
                      ফি আদায়ের অফিশিয়াল রসিদ (অফিস কপি)
                    </div>
                    <div className="flex justify-between text-[9px] pt-1">
                      <span>রসিদ নং: REC-2026-0042</span>
                      <span>তারিখ: ১২/০৩/২০২৬</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-200 flex justify-between font-bold text-slate-800">
                      <span>মাসিক বেতন (মার্চ ২০২৬)</span>
                      <span>৳ ৫০০/-</span>
                    </div>
                    <div className="flex justify-end pt-2">
                      <div className="text-center text-[8px]">
                        {signaturePreview ? (
                          <img src={signaturePreview} alt="Sig" className="h-5 mx-auto object-contain" />
                        ) : (
                          <span className="font-signature italic font-bold">Motiur</span>
                        )}
                        <span className="border-t border-slate-300 pt-0.5 block">আদায়কারীর স্বাক্ষর</span>
                      </div>
                    </div>
                  </div>
                )}

                {previewTab === 'admit' && (
                  <div className="space-y-1 text-slate-600">
                    <div className="text-center font-bold text-[10px] text-blue-800 bg-blue-50 py-0.5 rounded">
                      প্রবেশপত্র (১ম প্রান্তিক মূল্যায়ন ২০২৬)
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[9px] pt-1">
                      <div>শিক্ষার্থী: <strong>আব্দুল্লাহ আল নোমান</strong></div>
                      <div>শ্রেণি: <strong>৩য় শ্রেণি (শাখা ক)</strong></div>
                      <div>রোল: <strong>১</strong></div>
                      <div>আইডি: <strong>STD-2026-01</strong></div>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                      <span className="text-[8px] text-slate-400">পরীক্ষায় শৃঙ্খলা রক্ষা করুন</span>
                      <div className="text-center text-[8px]">
                        {signaturePreview ? (
                          <img src={signaturePreview} alt="Sig" className="h-5 mx-auto object-contain" />
                        ) : (
                          <span className="font-signature italic font-bold">Motiur</span>
                        )}
                        <span className="border-t border-slate-300 pt-0.5 block">প্রধান শিক্ষক</span>
                      </div>
                    </div>
                  </div>
                )}

                {previewTab === 'cert' && (
                  <div className="space-y-1.5 text-slate-600 text-center relative py-1">
                    {/* Watermark in background */}
                    {logoPreview && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        <img src={logoPreview} alt="Watermark" className="w-16 h-16 object-contain" />
                      </div>
                    )}
                    <div className="font-extrabold text-[11px] text-amber-800">
                      প্রশংসাপত্র / TESTIMONIAL
                    </div>
                    <p className="text-[8.5px] leading-relaxed text-slate-700">
                      প্রত্যয়ন করা যাচ্ছে যে, এই বিদ্যালয়ের একজন নিয়মিত ও চরিত্রবান শিক্ষার্থী ছিল।
                    </p>
                    <div className="flex justify-end pt-1">
                      <div className="text-center text-[8px]">
                        {signaturePreview ? (
                          <img src={signaturePreview} alt="Sig" className="h-5 mx-auto object-contain" />
                        ) : (
                          <span className="font-signature italic font-bold">Motiur</span>
                        )}
                        <span className="border-t border-slate-300 pt-0.5 block">প্রধান শিক্ষক</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={handleSave}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>লোগো ও স্বাক্ষর চূড়ান্তভাবে সংরক্ষণ করুন</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
