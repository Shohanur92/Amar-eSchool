import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FeeReceipt, Student } from '../../types';
import { toBanglaNumber, toBanglaWords } from '../../utils/bengaliUtils';
import { OnlinePaymentModal } from '../OnlinePaymentModal';
import {
  Receipt,
  Plus,
  Printer,
  Search,
  CheckCircle,
  CreditCard,
  Smartphone,
  Calendar,
  X,
  FileText,
  DollarSign
} from 'lucide-react';

export const FeesView: React.FC = () => {
  const {
    students,
    classes,
    feeReceipts,
    addFeeReceipt,
    settings,
    currentUser,
    sendSms
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [printableReceipt, setPrintableReceipt] = useState<FeeReceipt | null>(null);

  // Online Payment Gateway Modal state
  const [onlinePayModalOpen, setOnlinePayModalOpen] = useState(false);
  const [onlinePayStudent, setOnlinePayStudent] = useState<Student | null>(null);
  const [onlinePayAmount, setOnlinePayAmount] = useState<number>(550);

  // Fee collection form state
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [feeItems, setFeeItems] = useState<{ id: string; name: string; amount: number }[]>([
    { id: '1', name: 'মাসিক বেতন (মার্চ ২০২৬)', amount: 350 },
    { id: '2', name: 'পরীক্ষার ফি (১ম প্রান্তিক)', amount: 200 },
  ]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank'>('cash');
  const [transactionId, setTransactionId] = useState('');

  const totalFeeAmount = feeItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handleAddFeeItem = () => {
    setFeeItems([
      ...feeItems,
      { id: Date.now().toString(), name: 'অন্যান্য ফি', amount: 100 },
    ]);
  };

  const handleRemoveFeeItem = (id: string) => {
    setFeeItems(feeItems.filter((i) => i.id !== id));
  };

  const handleCollectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const receipt = addFeeReceipt({
      studentId: selectedStudent.id,
      classId: selectedStudent.classId,
      date: new Date().toISOString().split('T')[0],
      items: feeItems,
      totalAmount: totalFeeAmount,
      paidAmount: totalFeeAmount,
      dueAmount: 0,
      paymentMethod,
      transactionId: transactionId || (paymentMethod !== 'cash' ? `TRX${Date.now().toString().slice(-6)}` : undefined),
      collectedBy: currentUser?.name || 'প্রধান শিক্ষক',
    });

    // Send SMS receipt confirmation to parent
    const smsText = `${settings.name}: ${selectedStudent.name} (রোল: ${toBanglaNumber(selectedStudent.roll)}) এর ফি বাবদ ${toBanglaNumber(totalFeeAmount)}/- টাকা গৃহীত হয়েছে। রসিদ নং: ${receipt.receiptNo}। ধন্যবাদ।`;
    await sendSms(selectedStudent.guardianPhone, 'অভিভাবক', smsText, 'fee', selectedStudent.name);

    setIsCollectModalOpen(false);
    setPrintableReceipt(receipt);
  };

  const handleOpenOnlinePay = (student: Student) => {
    setOnlinePayStudent(student);
    setOnlinePayAmount(550);
    setOnlinePayModalOpen(true);
  };

  const handleOnlinePaySuccess = (method: 'bkash' | 'nagad' | 'rocket' | 'bank', trxId: string) => {
    if (!onlinePayStudent) return;
    const receipt = addFeeReceipt({
      studentId: onlinePayStudent.id,
      classId: onlinePayStudent.classId,
      date: new Date().toISOString().split('T')[0],
      items: [
        { id: '1', name: 'মাসিক বেতন (মার্চ ২০২৬)', amount: 350 },
        { id: '2', name: 'পরীক্ষার ফি', amount: 200 },
      ],
      totalAmount: 550,
      paidAmount: 550,
      dueAmount: 0,
      paymentMethod: method,
      transactionId: trxId,
      collectedBy: 'অনলাইন গেটওয়ে',
    });
    setPrintableReceipt(receipt);
  };

  const filteredReceipts = feeReceipts.filter((r) => {
    const student = students.find((s) => s.id === r.studentId);
    const matchesSearch =
      r.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(student?.roll).includes(searchQuery);
    const matchesClass = selectedClass === 'all' || r.classId === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            <span>ফি আদায়, দ্বিকপি রসিদ ও অনলাইন পেমেন্ট</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            টাকা কথায় অটো-কনভার্সন, পাশাপাশি দ্বিকপি রসিদ প্রিন্ট ও বিকাশ/নগদ গেটওয়ে
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollectModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন ফি সংগ্রহ ও রসিদ তৈরি</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-60">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
          >
            <option value="all">সকল শ্রেণির রসিদ</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="রসিদ নম্বর, ছাত্রের নাম বা রোল দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
          />
        </div>
      </div>

      {/* Fee Receipts Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                <th className="p-3">রসিদ নম্বর</th>
                <th className="p-3">শিক্ষার্থীর বিবরণ</th>
                <th className="p-3">তারিখ</th>
                <th className="p-3">ফি বিবরণী</th>
                <th className="p-3 text-right">আদায়কৃত টাকা</th>
                <th className="p-3">পদ্ধতি</th>
                <th className="p-3 text-right">দ্বিকপি রসিদ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredReceipts.map((rc) => {
                const st = students.find((s) => s.id === rc.studentId);
                const cls = classes.find((c) => c.id === rc.classId);

                return (
                  <tr key={rc.id} className="hover:bg-slate-50/70">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                      {rc.receiptNo}
                    </td>
                    <td className="p-3">
                      <div className="font-extrabold text-slate-900 dark:text-white">{st?.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {cls?.name} • রোল: {toBanglaNumber(st?.roll)}
                      </div>
                    </td>
                    <td className="p-3 text-slate-500 font-medium">{rc.date}</td>
                    <td className="p-3">
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        {rc.items.map((i) => i.name).join(', ')}
                      </div>
                    </td>
                    <td className="p-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                      ৳ {toBanglaNumber(rc.paidAmount)}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {rc.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setPrintableReceipt(rc)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>দ্বিকপি প্রিন্ট</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Online Payment for Students list widget */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-pink-600" />
          <span>অভিভাবক অনলাইন ফি পেমেন্ট গেটওয়ে (বিকাশ / নগদ / রকেট)</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          যে কোনো শিক্ষার্থীর বেতন সরাসরি ডিজিটাল মাধ্যমে গ্রহণ করুন:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {students.slice(0, 3).map((st) => (
            <div
              key={st.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-white">{st.name}</p>
                <p className="text-[10px] text-slate-500">
                  {classes.find((c) => c.id === st.classId)?.name} • রোল: {toBanglaNumber(st.roll)}
                </p>
                <p className="text-[10px] text-rose-500 font-bold mt-0.5">বকেয়া: ৳ ৫৫০</p>
              </div>
              <button
                onClick={() => handleOpenOnlinePay(st)}
                className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-xs"
              >
                পেমেন্ট নিন
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Collect Fee Modal */}
      {isCollectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                নতুন ফি আদায় ও স্বয়ংক্রিয় রসিদ তৈরি
              </h3>
              <button
                onClick={() => setIsCollectModalOpen(false)}
                className="p-1 rounded-lg text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCollectSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">শিক্ষার্থী নির্বাচন *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  {students.map((s) => {
                    const cls = classes.find((c) => c.id === s.classId);
                    return (
                      <option key={s.id} value={s.id}>
                        {s.name} ({cls?.name}, রোল: {toBanglaNumber(s.roll)})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Fee Heads */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold">ফি এর খাতসমূহ:</label>
                  <button
                    type="button"
                    onClick={handleAddFeeItem}
                    className="text-[11px] font-bold text-emerald-600 hover:underline"
                  >
                    + নতুন খাত যোগ
                  </button>
                </div>

                {feeItems.map((item, idx) => (
                  <div key={item.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const updated = [...feeItems];
                        updated[idx].name = e.target.value;
                        setFeeItems(updated);
                      }}
                      className="flex-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                    />
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => {
                        const updated = [...feeItems];
                        updated[idx].amount = parseInt(e.target.value) || 0;
                        setFeeItems(updated);
                      }}
                      className="w-24 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-right"
                    />
                    {feeItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFeeItem(item.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Total & Money in Words Preview */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1">
                <div className="flex justify-between items-center text-sm font-extrabold text-emerald-950 dark:text-emerald-100">
                  <span>সর্বমোট ফি:</span>
                  <span>৳ {toBanglaNumber(totalFeeAmount)}</span>
                </div>
                <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                  কথায়: {toBanglaWords(totalFeeAmount)}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-bold mb-1">পরিশোধের মাধ্যম:</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['cash', 'bkash', 'nagad', 'rocket'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`p-2 rounded-xl border text-center font-bold uppercase text-[10px] ${
                        paymentMethod === m
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCollectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  আদায় সম্পন্ন ও রসিদ তৈরি
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Online Payment Modal */}
      {onlinePayStudent && (
        <OnlinePaymentModal
          isOpen={onlinePayModalOpen}
          onClose={() => setOnlinePayModalOpen(false)}
          student={onlinePayStudent}
          amount={onlinePayAmount}
          feeTitle="মাসিক বেতন ও পরীক্ষার ফি"
          onSuccess={handleOnlinePaySuccess}
        />
      )}

      {/* DUPLICATE RECEIPT PRINT PREVIEW MODAL (STUDENT COPY + OFFICE COPY SIDE-BY-SIDE) */}
      {printableReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 max-h-[95vh] overflow-y-auto relative">
            <div className="flex items-center justify-between border-b pb-3 mb-4 no-print">
              <div>
                <h4 className="font-black text-sm text-slate-900">
                  দ্বিকপি মানি রিসিট (A4 পাতায় পাশাপাশি ২টি কপি)
                </h4>
                <p className="text-xs text-slate-500">বামপাশে ছাত্র কপি ও ডানপাশে অফিস কপি</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Printer className="w-4 h-4" />
                  <span>রসিদ প্রিন্ট করুন</span>
                </button>
                <button
                  onClick={() => setPrintableReceipt(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* DUPLICATE SIDE-BY-SIDE LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-2 border-slate-300 p-4 rounded-xl bg-white text-slate-900">
              {/* Copy 1: Student Copy */}
              <div className="border border-slate-300 p-4 rounded-lg text-xs space-y-3 relative">
                <div className="flex items-center justify-center gap-2.5 border-b pb-2 text-center">
                  {settings.logoUrl && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                      <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain p-0.5" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-black text-sm text-emerald-900 leading-tight">{settings.name}</h3>
                    <p className="text-[9px] text-slate-500">{settings.address}</p>
                    <div className="inline-block mt-0.5 px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[9px] font-black uppercase">
                      মানি রিসিট [ ছাত্র কপি ]
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-[11px]">
                  <span>রসিদ নং: <strong className="font-mono">{printableReceipt.receiptNo}</strong></span>
                  <span>তারিখ: <strong>{printableReceipt.date}</strong></span>
                </div>

                {(() => {
                  const st = students.find((s) => s.id === printableReceipt.studentId);
                  const cls = classes.find((c) => c.id === printableReceipt.classId);
                  return (
                    <div className="bg-slate-50 p-2 rounded text-[11px] space-y-0.5">
                      <p>শিক্ষার্থীর নাম: <strong>{st?.name}</strong></p>
                      <p>শ্রেণি: <strong>{cls?.name}</strong> | রোল: <strong>{toBanglaNumber(st?.roll)}</strong></p>
                    </div>
                  );
                })()}

                <table className="w-full text-[10px] border border-slate-300 text-center">
                  <thead>
                    <tr className="bg-slate-100 font-bold">
                      <th className="p-1 border border-slate-300 text-left pl-2">ফি এর বিবরণ</th>
                      <th className="p-1 border border-slate-300 w-16 text-right pr-2">টাকা</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printableReceipt.items.map((i, idx) => (
                      <tr key={idx}>
                        <td className="p-1 border border-slate-300 text-left pl-2">{i.name}</td>
                        <td className="p-1 border border-slate-300 text-right pr-2">{toBanglaNumber(i.amount)}/-</td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-slate-50">
                      <td className="p-1 border border-slate-300 text-left pl-2">মোট আদায়:</td>
                      <td className="p-1 border border-slate-300 text-right pr-2">৳ {toBanglaNumber(printableReceipt.paidAmount)}/-</td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-[10px] text-slate-700 bg-slate-50 p-1.5 rounded">
                  কথায়: <strong>{toBanglaWords(printableReceipt.paidAmount)}</strong>
                </div>

                <div className="pt-6 flex justify-between text-[10px] items-end">
                  <span className="text-slate-400">মাধ্যম: {printableReceipt.paymentMethod.toUpperCase()}</span>
                  <div className="text-center">
                    <span className="border-t border-slate-400 pt-0.5 block font-bold">আদায়কারীর স্বাক্ষর</span>
                  </div>
                </div>
              </div>

              {/* Copy 2: Office Copy */}
              <div className="border border-slate-300 p-4 rounded-lg text-xs space-y-3 relative">
                <div className="flex items-center justify-center gap-2.5 border-b pb-2 text-center">
                  {settings.logoUrl && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                      <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain p-0.5" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-black text-sm text-emerald-900 leading-tight">{settings.name}</h3>
                    <p className="text-[9px] text-slate-500">{settings.address}</p>
                    <div className="inline-block mt-0.5 px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[9px] font-black uppercase">
                      মানি রিসিট [ অফিস কপি ]
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-[11px]">
                  <span>রসিদ নং: <strong className="font-mono">{printableReceipt.receiptNo}</strong></span>
                  <span>তারিখ: <strong>{printableReceipt.date}</strong></span>
                </div>

                {(() => {
                  const st = students.find((s) => s.id === printableReceipt.studentId);
                  const cls = classes.find((c) => c.id === printableReceipt.classId);
                  return (
                    <div className="bg-slate-50 p-2 rounded text-[11px] space-y-0.5">
                      <p>শিক্ষার্থীর নাম: <strong>{st?.name}</strong></p>
                      <p>শ্রেণি: <strong>{cls?.name}</strong> | রোল: <strong>{toBanglaNumber(st?.roll)}</strong></p>
                    </div>
                  );
                })()}

                <table className="w-full text-[10px] border border-slate-300 text-center">
                  <thead>
                    <tr className="bg-slate-100 font-bold">
                      <th className="p-1 border border-slate-300 text-left pl-2">ফি এর বিবরণ</th>
                      <th className="p-1 border border-slate-300 w-16 text-right pr-2">টাকা</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printableReceipt.items.map((i, idx) => (
                      <tr key={idx}>
                        <td className="p-1 border border-slate-300 text-left pl-2">{i.name}</td>
                        <td className="p-1 border border-slate-300 text-right pr-2">{toBanglaNumber(i.amount)}/-</td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-slate-50">
                      <td className="p-1 border border-slate-300 text-left pl-2">মোট আদায়:</td>
                      <td className="p-1 border border-slate-300 text-right pr-2">৳ {toBanglaNumber(printableReceipt.paidAmount)}/-</td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-[10px] text-slate-700 bg-slate-50 p-1.5 rounded">
                  কথায়: <strong>{toBanglaWords(printableReceipt.paidAmount)}</strong>
                </div>

                <div className="pt-6 flex justify-between text-[10px] items-end">
                  <span className="text-slate-400">মাধ্যম: {printableReceipt.paymentMethod.toUpperCase()}</span>
                  <div className="text-center">
                    <span className="border-t border-slate-400 pt-0.5 block font-bold">অফিস সিল ও স্বাক্ষর</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
