import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import { toBanglaNumber, toBanglaWords } from '../utils/bengaliUtils';
import { CheckCircle2, CreditCard, Smartphone, ShieldCheck, X } from 'lucide-react';

interface OnlinePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  amount: number;
  feeTitle: string;
  onSuccess: (method: 'bkash' | 'nagad' | 'rocket' | 'bank', trxId: string) => void;
}

export const OnlinePaymentModal: React.FC<OnlinePaymentModalProps> = ({
  isOpen,
  onClose,
  student,
  amount,
  feeTitle,
  onSuccess,
}) => {
  const [method, setMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');
  const [mobileNumber, setMobileNumber] = useState(student.guardianPhone.replace(/\D/g, '') || '01711223344');
  const [pin, setPin] = useState('1234');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [trxId, setTrxId] = useState('');

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const generatedTrxId = `${method.toUpperCase().slice(0, 2)}${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

    setTimeout(() => {
      setIsProcessing(false);
      setCompleted(true);
      setTrxId(generatedTrxId);
      onSuccess(method, generatedTrxId);
    }, 1200);
  };

  const getMethodColor = () => {
    switch (method) {
      case 'bkash':
        return 'from-pink-600 to-rose-600';
      case 'nagad':
        return 'from-orange-500 to-amber-600';
      case 'rocket':
        return 'from-purple-600 to-indigo-600';
      case 'bank':
        return 'from-emerald-600 to-teal-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
        <div className={`p-5 bg-gradient-to-r ${getMethodColor()} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Smartphone className="w-5 h-5" />
            <h3 className="font-bold text-base">অনলাইন ফি পেমেন্ট গেটওয়ে</h3>
          </div>
          <p className="text-xs text-white/80">
            শিক্ষার্থী: {student.name} (রোল: {toBanglaNumber(student.roll)})
          </p>
          <div className="mt-3 flex items-baseline justify-between bg-black/20 p-2.5 rounded-xl">
            <span className="text-xs">{feeTitle}</span>
            <span className="text-xl font-black">৳ {toBanglaNumber(amount)}</span>
          </div>
        </div>

        <div className="p-5">
          {!completed ? (
            <form onSubmit={handlePay} className="space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  পেমেন্ট মাধ্যম নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('bkash')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      method === 'bkash'
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 font-bold ring-2 ring-pink-500/30'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-black text-pink-600">bKash</div>
                    <div className="text-[10px]">বিকাশ</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('nagad')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      method === 'nagad'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold ring-2 ring-orange-500/30'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-black text-orange-600">Nagad</div>
                    <div className="text-[10px]">নগদ</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('rocket')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      method === 'rocket'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold ring-2 ring-purple-500/30'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-black text-purple-600">Rocket</div>
                    <div className="text-[10px]">রকেট</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('bank')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      method === 'bank'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/30'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-black text-emerald-600">Cards</div>
                    <div className="text-[10px]">কার্ড / ব্যাংক</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {method === 'bank' ? 'কার্ড নম্বর / একাউন্ট' : `${method.toUpperCase()} একাউন্ট নম্বর`}
                </label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  গোপন পিন কোড (PIN)
                </label>
                <input
                  type="password"
                  maxLength={5}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                  placeholder="••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono tracking-widest focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <p className="text-[10px] text-slate-400 mt-1">টেস্ট ডেমো পিন: ১২৩৪</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>নিরাপদ SSL এনক্রিপ্টেড পেমেন্ট গেটওয়ে। পরিশোধের সাথে সাথেই রসিদ ইস্যু হবে।</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>পেমেন্ট প্রসেস হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>৳ {toBanglaNumber(amount)} টাকা পরিশোধ নিশ্চিত করুন</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">পেমেন্ট সফল হয়েছে!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                লেনদেন আইডি: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{trxId}</strong>
              </p>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                স্বয়ংক্রিয়ভাবে দ্বিকপি রসিদ তৈরি হয়েছে এবং ফি আদায় রেজিস্টারে সংরক্ষিত হয়েছে।
              </div>
              <button
                onClick={onClose}
                className="w-full py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
              >
                বন্ধ করুন ও রসিদ দেখুন
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
