// Bengali digit translation and number-in-words converter

const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function toBanglaNumber(value: number | string | undefined | null): string {
  if (value === undefined || value === null) return '';
  const str = String(value);
  return str.replace(/[0-9]/g, (match) => banglaDigits[parseInt(match, 10)]);
}

export function toEnglishNumber(str: string): number {
  if (!str) return 0;
  let engStr = '';
  for (const char of str) {
    const idx = banglaDigits.indexOf(char);
    if (idx !== -1) {
      engStr += englishDigits[idx];
    } else {
      engStr += char;
    }
  }
  const parsed = parseFloat(engStr);
  return isNaN(parsed) ? 0 : parsed;
}

const oneToNinetyNineBn: { [key: number]: string } = {
  1: 'এক', 2: 'দুই', 3: 'তিন', 4: 'চার', 5: 'পাঁচ', 6: 'ছয়', 7: 'সাত', 8: 'আট', 9: 'নয়', 10: 'দশ',
  11: 'এগারো', 12: 'বারো', 13: 'তেরো', 14: 'চৌদ্দ', 15: 'পনেরো', 16: 'ষোলো', 17: 'সতেরো', 18: 'আঠারো', 19: 'উনিশ', 20: 'বিশ',
  21: 'একুশ', 22: 'বাইশ', 23: 'তেইশ', 24: 'চব্বিশ', 25: 'পঁচিশ', 26: 'ছাব্বিশ', 27: 'সাতাশ', 28: 'আঠাশ', 29: 'উনত্রিশ', 30: 'ত্রিশ',
  31: 'একত্রিশ', 32: 'বত্রিশ', 33: 'তেত্রিশ', 34: 'চৌত্রিশ', 35: 'পঁয়ত্রিশ', 36: 'ছত্রিশ', 37: 'সাঁইত্রিশ', 38: 'আটত্রিশ', 39: 'উনচল্লিশ', 40: 'চল্লিশ',
  41: 'একচল্লিশ', 42: 'বিয়াল্লিশ', 43: 'তেতাল্লিশ', 44: 'চুয়াল্লিশ', 45: 'পঁয়তাল্লিশ', 46: 'ছেচল্লিশ', 47: 'সাতচল্লিশ', 48: 'আটচল্লিশ', 49: 'উনপঞ্চাশ', 50: 'পঞ্চাশ',
  51: 'একান্ন', 52: 'বায়ান্ন', 53: 'তিপ্পান্ন', 54: 'চুয়ান্ন', 55: 'পঞ্চান্ন', 56: 'ছাপ্পান্ন', 57: 'সাতান্ন', 58: 'আটান্ন', 59: 'উনষাট', 60: 'ষাট',
  61: 'একষট্টি', 62: 'বাষট্টি', 63: 'তেষট্টি', 64: 'চৌষট্টি', 65: 'পঁয়ষট্টি', 66: 'ছেষট্টি', 67: 'সাতষট্টি', 68: 'আটষট্টি', 69: 'উনসত্তর', 70: 'সত্তর',
  71: 'একাত্তর', 72: 'বাহাত্তর', 73: 'তিয়াত্তর', 74: 'চুয়াত্তর', 75: 'পঁচাত্তর', 76: 'ছিয়াত্তর', 77: 'সাতাত্তর', 78: 'আটাত্তর', 79: 'উনআশি', 80: 'আশি',
  81: 'একাশি', 82: 'বিরাশি', 83: 'তিরাশি', 84: 'চুরাশি', 85: 'পঁচাশি', 86: 'ছিয়াশি', 87: 'সাতাশি', 88: 'অষ্টআশি', 89: 'উননব্বই', 90: 'নব্বই',
  91: 'একানব্বই', 92: 'বিরানব্বই', 93: 'তিরানব্বই', 94: 'চুরানব্বই', 95: 'পঁচানব্বই', 96: 'ছিয়ানব্বই', 97: 'সাতানব্বই', 98: 'আটানব্বই', 99: 'নিরানব্বই'
};

export function toBanglaWords(amount: number): string {
  if (amount <= 0 || isNaN(amount)) return 'শূন্য টাকা মাত্র';
  const num = Math.floor(amount);
  
  if (num === 0) return 'শূন্য টাকা মাত্র';

  function convertTwoDigits(n: number): string {
    if (n === 0) return '';
    return oneToNinetyNineBn[n] || '';
  }

  const parts: string[] = [];

  const crore = Math.floor(num / 10000000);
  const remainingAfterCrore = num % 10000000;

  const lakh = Math.floor(remainingAfterCrore / 100000);
  const remainingAfterLakh = remainingAfterCrore % 100000;

  const thousand = Math.floor(remainingAfterLakh / 1000);
  const remainingAfterThousand = remainingAfterLakh % 1000;

  const hundred = Math.floor(remainingAfterThousand / 100);
  const remainingUnderHundred = remainingAfterThousand % 100;

  if (crore > 0) parts.push(`${toBanglaWords(crore).replace(' টাকা মাত্র', '')} কোটি`);
  if (lakh > 0) parts.push(`${convertTwoDigits(lakh)} লাখ`);
  if (thousand > 0) parts.push(`${convertTwoDigits(thousand)} হাজার`);
  if (hundred > 0) parts.push(`${convertTwoDigits(hundred)} শত`);
  if (remainingUnderHundred > 0) parts.push(convertTwoDigits(remainingUnderHundred));

  return `${parts.join(' ')} টাকা মাত্র`;
}

export function calculateGrade(marks: number, fullMarks: number = 100): { grade: string; point: number; color: string } {
  const percentage = (marks / fullMarks) * 100;
  if (percentage >= 80) return { grade: 'A+', point: 5.0, color: 'text-emerald-600 bg-emerald-50' };
  if (percentage >= 70) return { grade: 'A', point: 4.0, color: 'text-green-600 bg-green-50' };
  if (percentage >= 60) return { grade: 'A-', point: 3.5, color: 'text-teal-600 bg-teal-50' };
  if (percentage >= 50) return { grade: 'B', point: 3.0, color: 'text-blue-600 bg-blue-50' };
  if (percentage >= 40) return { grade: 'C', point: 2.0, color: 'text-amber-600 bg-amber-50' };
  if (percentage >= 33) return { grade: 'D', point: 1.0, color: 'text-orange-600 bg-orange-50' };
  return { grade: 'F', point: 0.0, color: 'text-rose-600 bg-rose-50' };
}

export function formatBanglaDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const monthsBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const day = toBanglaNumber(date.getDate());
  const month = monthsBn[date.getMonth()];
  const year = toBanglaNumber(date.getFullYear());

  return `${day} ${month}, ${year}`;
}
