/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Offer, ColorOption, Review, Order } from './types';

export const OFFERS: Offer[] = [
  {
    id: 'two-pieces',
    title: 'قطعتين بـ 22 دينار (العرض الأوفر والأكثر طلباً) 🔥',
    price: 22,
    oldPrice: 28,
    isPopular: true,
    badge: 'الأكثر مبيعاً',
    savings: 'وفري 6 دنانير كاملة!'
  },
  {
    id: 'one-piece',
    title: 'قطعة واحدة بـ 14 دينار',
    price: 14,
    isPopular: false
  }
];

export const COLORS: ColorOption[] = [
  { id: 'black', name: 'أسود الملكي C#1', code: 'C#1', hex: '#111111', secondaryHex: '#d4af37' },
  { id: 'charcoal', name: 'رمادي فحمي C#2', code: 'C#2', hex: '#2b2b2a', secondaryHex: '#9d6b7c' },
  { id: 'sky-blue', name: 'أزرق سماوي C#3', code: 'C#3', hex: '#8ca9c2', secondaryHex: '#ffffff' },
  { id: 'dark-green', name: 'أخضر داكن C#5', code: 'C#5', hex: '#1e3325', secondaryHex: '#d4af37' },
  { id: 'burgundy', name: 'برغندي عميق C#6', code: 'C#6', hex: '#4a121a', secondaryHex: '#d4af37' },
  { id: 'dusty-rose', name: 'وردي عتيق C#7', code: 'C#7', hex: '#875667', secondaryHex: '#ffffff' },
  { id: 'beige', name: 'بيج رمادي C#9', code: 'C#9', hex: '#b0a68d', secondaryHex: '#111111' }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'رانيا أحمد (عمان)',
    rating: 5,
    comment: 'العباية بتجنن يا بنات! الخامة كريب تركي ثقيل ومريح جداً، والستراس بلمع بطريقة بتوخذ العقل. والأحلى إنه سمحولي أفتح الطرد وأفحصها قبل ما أدفع. أنصح فيها وبشدة 😍👍',
    date: 'منذ يومين',
    verified: true,
    avatarColor: 'bg-rose-100 text-rose-700'
  },
  {
    id: 'rev-2',
    name: 'أم محمد (الزرقاء)',
    rating: 5,
    comment: 'طلبت عرض القطعتين (الأسود والوردي العتيق) وطلعوا تحفة وتوفير كبير. التوصيل كان سريع جداً لخلال ٢٤ ساعة وخدمة العملاء محترمين جداً تواصلوا معي للمقاس.',
    date: 'منذ 3 أيام',
    verified: true,
    avatarColor: 'bg-amber-100 text-amber-700'
  },
  {
    id: 'rev-3',
    name: 'سحر عبيدات (إربد)',
    rating: 5,
    comment: 'خامة الكريب ناعمة وباردة بتجنن للبس اليومي والمناسبات، والستراس مثبت بإتقان مش من النوع اللي بوقع بالغسيل. شكراً جزيلاً على الأمانة والجودة.',
    date: 'منذ أسبوع',
    verified: true,
    avatarColor: 'bg-teal-100 text-teal-700'
  }
];

// Seed initial orders to make the seller dashboard interactive and rich from day one
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-5489',
    name: 'سلمى الحايك',
    phone: '0798765432',
    offer: 'قطعتين بـ 22 دينار (العرض الأوفر والأكثر طلباً) 🔥',
    color: 'أسود الملكي C#1',
    weight: 68,
    height: 162,
    address: 'عمان - تلاع العلي - قرب سوق السلطان',
    date: '2026-06-28T18:30:00Z',
    status: 'pending',
    totalPrice: 22,
    notes: 'يرجى التوصيل بعد الساعة 4 مساءً'
  },
  {
    id: 'ORD-5488',
    name: 'منى الشريف',
    phone: '0782211443',
    offer: 'قطعتين بـ 22 دينار (العرض الأوفر والأكثر طلباً) 🔥',
    color: 'وردي عتيق C#7',
    weight: 75,
    height: 158,
    address: 'الزرقاء - حي معصوم - شارع اليرموك',
    date: '2026-06-28T14:15:00Z',
    status: 'confirmed',
    totalPrice: 22,
    notes: 'تم التأكيد هاتفياً، القياس مناسب'
  },
  {
    id: 'ORD-5487',
    name: 'ديما حداد',
    phone: '0779871122',
    offer: 'قطعة واحدة بـ 14 دينار',
    color: 'برغندي عميق C#6',
    weight: 85,
    height: 167,
    address: 'إربد - شارع الجامعة - خلف المكتبة',
    date: '2026-06-27T11:00:00Z',
    status: 'shipped',
    totalPrice: 14,
    notes: 'تم الشحن مع شركة أرامكس'
  },
  {
    id: 'ORD-5486',
    name: 'لينا القضاة',
    phone: '0791122334',
    offer: 'قطعتين بـ 22 دينار (العرض الأوفر والأكثر طلباً) 🔥',
    color: 'أخضر داكن C#5',
    weight: 60,
    height: 155,
    address: 'العقبة - حي الخامسة - عمارة رقم 12',
    date: '2026-06-26T09:45:00Z',
    status: 'cancelled',
    totalPrice: 22,
    notes: 'ألغت الطلب بسبب السفر المفاجئ'
  }
];
