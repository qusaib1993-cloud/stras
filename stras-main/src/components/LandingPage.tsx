/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { OFFERS, COLORS, REVIEWS } from '../data';
import { ColorOption, Offer } from '../types';
import { 
  Sparkles, 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  Flame, 
  Clock, 
  ShoppingBag, 
  ChevronRight, 
  ChevronLeft,
  Star, 
  MapPin, 
  Scale, 
  Ruler,
  Phone,
  User,
  Heart,
  Quote,
  LayoutGrid,
  MessageSquare
} from 'lucide-react';

interface LandingPageProps {
  onOrderSubmit: (order: {
    name: string;
    phone: string;
    offer: string;
    color: string;
    weight: number;
    height: number;
    address: string;
  }) => void;
  onGoToDashboard: () => void;
}

const LANDING_TESTIMONIALS = [
  {
    id: 't-1',
    name: 'رانيا أحمد (عمان)',
    rating: 5,
    tag: 'خامة الكريب',
    comment: 'العباية بتجنن يا بنات! الخامة كريب تركي ثقيل ومريح جداً، والستراس بلمع بطريقة بتوخذ العقل. والأحلى إنه سمحولي أفتح الطرد وأفحصها قبل ما أدفع. أنصح فيها وبشدة 😍👍',
    date: 'منذ يومين',
    verified: true,
    avatarColor: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    initials: 'ر'
  },
  {
    id: 't-2',
    name: 'أم محمد (الزرقاء)',
    rating: 5,
    tag: 'العرض الأوفر',
    comment: 'طلبت عرض القطعتين (الأسود والوردي العتيق) وطلعوا تحفة وتوفير كبير. التوصيل كان سريع جداً لخلال ٢٤ ساعة وخدمة العملاء محترمين جداً تواصلوا معي للمقاس.',
    date: 'منذ 3 أيام',
    verified: true,
    avatarColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    initials: 'م'
  },
  {
    id: 't-3',
    name: 'سحر عبيدات (إربد)',
    rating: 5,
    tag: 'تطريز الستراس',
    comment: 'خامة الكريب ناعمة وباردة بتجنن للبس اليومي والمناسبات، والستراس مثبت بإتقان مش من النوع اللي بوقع بالغسيل. شكراً جزيلاً على الأمانة والجودة.',
    date: 'منذ أسبوع',
    verified: true,
    avatarColor: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
    initials: 'س'
  },
  {
    id: 't-4',
    name: 'أم يوسف (العقبة)',
    rating: 5,
    tag: 'القياس والملاءمة',
    comment: 'اللون الكحلي والزيتي خرافيات! كنت خايفة من القياس بس تواصلت معي الصبية وأعطتني المقاس الصح مية بالمية. العباية مريحة جداً باللبس وساترة وبتجنن.',
    date: 'منذ 4 أيام',
    verified: true,
    avatarColor: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    initials: 'ي'
  },
  {
    id: 't-5',
    name: 'هبة المصري (عمان)',
    rating: 5,
    tag: 'سرعة التوصيل',
    comment: 'بصراحة التوصيل كان بأقل من ٢٤ ساعة، وبإمكانك تفتحي وتفحصي القماش قبل الدفع. الكريب جودته عالية جداً، ولون الأسود فاحم وجميل. بنصح بعرض القطعتين ممتاز للتوفير.',
    date: 'منذ يومين',
    verified: true,
    avatarColor: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    initials: 'ه'
  },
  {
    id: 't-6',
    name: 'سارة العبدالله (معان)',
    rating: 5,
    tag: 'تطريز الستراس',
    comment: 'الستراس بلمع وبجنن ومثبت كثير منيح مش متل العبايات العادية اللي بتخرب من أول غسلة. صرت طابة منهم ٣ مرات لصحباتي وأخواتي.',
    date: 'منذ أسبوعين',
    verified: true,
    avatarColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    initials: 'س'
  }
];

export default function LandingPage({ onOrderSubmit, onGoToDashboard }: LandingPageProps) {
  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(OFFERS[0].title);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(160);
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState('');

  // Testimonials states
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [testimonialLayout, setTestimonialLayout] = useState<'carousel' | 'grid'>('carousel');
  const [activeTestimonialTag, setActiveTestimonialTag] = useState('الكل');

  // Countdown timer for urgency
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          // Reset timer to 15 minutes once it hits zero to maintain urgency perpetually
          return { minutes: 14, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!name.trim()) {
      setFormError('يرجى كتابة الاسم الكامل');
      return;
    }

    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      setFormError('يرجى كتابة رقم الهاتف');
      return;
    }

    // Jordanian phone format validation (07 followed by 8 digits)
    const jordanPhoneRegex = /^(07[789]\d{7})$/;
    const cleanDigits = cleanPhone.replace(/[\s-]/g, '');
    if (!jordanPhoneRegex.test(cleanDigits)) {
      setFormError('يرجى إدخال رقم هاتف أردني صحيح يبدأ بـ 07 ويتكون من 10 أرقام (مثال: 0791234567)');
      return;
    }

    if (!address.trim()) {
      setFormError('يرجى كتابة عنوان التوصيل بالتفصيل');
      return;
    }

    onOrderSubmit({
      name,
      phone: cleanDigits,
      offer: selectedOffer,
      color: selectedColor.name,
      weight,
      height,
      address
    });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#1a1a1a] text-neutral-100 font-sans pb-24">
      {/* Top Mobile Container (Max 550px on desktop for high focus/conversion, centered) */}
      <div className="w-full max-w-[550px] mx-auto bg-[#111111] min-h-screen shadow-2xl relative border-x border-white/5">
        
        {/* Floating Admin Button - Subtle Gear for Merchant Portal */}
        <button 
          onClick={onGoToDashboard}
          className="absolute top-14 left-4 z-50 bg-[#161616]/80 hover:bg-neutral-900 text-[#d4af37] border border-[#d4af37]/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
          title="لوحة تحكم التاجر"
          id="btn-admin-panel"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          <span>لوحة التحكم ⚙️</span>
        </button>

        {/* 1. Header Urgency Banner */}
        <header className="bg-[#d4af37] py-2.5 px-4 text-center sticky top-0 z-40 text-black font-extrabold text-xs shadow-md">
          <div className="flex items-center justify-center gap-1.5">
            <Flame className="w-4 h-4 text-black animate-pulse" />
            <span>🔥 عرض خاص: قطعتين بـ 22 دينار + توصيل مجاني لباب البيت 👀</span>
            <div className="flex gap-1 font-mono text-black bg-black/15 px-1.5 py-0.5 rounded text-[10px] font-black mr-1">
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="animate-pulse">:</span>
              <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </header>

        {/* 2. Premium Brand Header */}
        <div className="bg-[#111111] relative pt-8 pb-6 text-center text-white border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9d6b7c]/15 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="inline-block px-4 py-1 border border-[#d4af37] text-[#d4af37] text-[10px] tracking-[0.2em] uppercase mb-4 rounded-sm font-semibold">
              Luxury Collection
            </div>
            <h1 className="text-2xl font-serif leading-[1.2] text-white font-black px-4">
              عباية الستراس <span className="text-[#9d6b7c] italic font-normal text-xl block mt-1">الفخامة الملكية</span>
            </h1>
            <p className="text-xs text-neutral-400 mt-2 max-w-[85%] mx-auto leading-relaxed">
              خامة كريب تركي ناعمة ومريحة جداً تناسب حركتك اليومية وتمنحك الأناقة الكاملة بـ 7 ألوان ساحرة طبق الأصل من الطبيعة.
            </p>
          </div>
        </div>

        {/* 3. Interactive Abaya Visual Customizer */}
        <div className="p-4 bg-[#111111] border-b border-white/5">
          <div className="bg-[#161616] rounded-2xl p-6 relative overflow-hidden shadow-inner flex flex-col items-center border border-white/5">
            
            {/* Ambient Backlight matching selected color */}
            <div 
              className="absolute inset-0 opacity-20 blur-3xl transition-all duration-500 rounded-full"
              style={{ 
                background: `radial-gradient(circle, ${selectedColor.hex} 0%, rgba(0,0,0,0) 70%)` 
              }}
            />

            {/* Shimmering Dust animation */}
            <div className="absolute top-2 right-2 flex gap-1 text-[10px] text-amber-400 font-bold bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm border border-amber-500/20">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>معاينة حية للون</span>
            </div>

            {/* Vector Illustration of the Luxury Abaya - interactive color change! */}
            <div className="w-48 h-64 relative z-10 flex items-center justify-center transition-transform duration-500 hover:scale-105">
              <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                {/* Abaya Shadow */}
                <ellipse cx="50" cy="115" rx="30" ry="4" fill="rgba(0,0,0,0.4)" />
                
                {/* Abaya Body (Changes Fill color based on selectedColor) */}
                <path 
                  d="M 50,12 L 20,110 L 80,110 Z" 
                  fill={selectedColor.hex} 
                  className="transition-all duration-500"
                  stroke="#222222"
                  strokeWidth="0.5"
                />
                
                {/* Elegant sleeves */}
                <path 
                  d="M 50,15 L 12,50 L 22,110 L 50,110 Z" 
                  fill={selectedColor.hex} 
                  opacity="0.95" 
                  className="transition-all duration-500"
                />
                <path 
                  d="M 50,15 L 88,50 L 78,110 L 50,110 Z" 
                  fill={selectedColor.hex} 
                  opacity="0.95" 
                  className="transition-all duration-500"
                />

                {/* Sleeve Gold Trim (Strass) */}
                <path d="M 12,50 L 17,55" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
                <path d="M 88,50 L 83,55" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />

                {/* Neck scarf / Hijab Overlay matching or contrasting */}
                <path 
                  d="M 38,12 C 38,0 62,0 62,12 C 62,18 38,18 38,12 Z" 
                  fill="#111111" 
                  stroke="#d4af37" 
                  strokeWidth="0.5"
                />
                
                {/* Golden strass sparkling down the center seam */}
                <line x1="50" y1="18" x2="50" y2="110" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="1,4" strokeLinecap="round" className="animate-pulse" />
                
                {/* Elegant collar overlay */}
                <path 
                  d="M 38,12 L 50,45 L 62,12" 
                  fill="none" 
                  stroke="#d4af37" 
                  strokeWidth="1" 
                  opacity="0.8"
                />

                {/* Additional crystal details on the chest */}
                <circle cx="45" cy="30" r="1" fill="#fff" className="animate-ping" style={{ animationDuration: '2s' }} />
                <circle cx="55" cy="35" r="1.2" fill="#d4af37" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                <circle cx="48" cy="45" r="0.8" fill="#fff" className="animate-ping" style={{ animationDuration: '1.8s' }} />
                <circle cx="52" cy="55" r="1.1" fill="#d4af37" className="animate-ping" style={{ animationDuration: '2.2s' }} />
              </svg>
            </div>

            {/* Live Color Label */}
            <div className="mt-3 text-center z-10">
              <span className="text-white text-sm font-semibold block">{selectedColor.name}</span>
              <span className="text-[11px] text-[#d4af37] font-mono mt-0.5 inline-block bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                كود القماش التركي: {selectedColor.code}
              </span>
            </div>

            {/* Quick interactive color switcher circles right on the product viewer */}
            <div className="flex flex-wrap justify-center gap-2 mt-4 z-10 max-w-[85%]">
              {COLORS.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedColor(col)}
                  className={`w-7 h-7 rounded-full border-2 transition-all duration-300 relative flex items-center justify-center ${
                    selectedColor.id === col.id ? 'border-[#d4af37] scale-115 shadow-md shadow-black/50' : 'border-neutral-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                  id={`color-picker-${col.id}`}
                >
                  {selectedColor.id === col.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                  )}
                </button>
              ))}
            </div>

          </div>
          <p className="text-[11px] text-neutral-400 text-center mt-2.5">
            💡 اضغطي على الدوائر الملونة لرؤية العباية على الطبيعة بلونها المفضل!
          </p>
        </div>

        {/* 4. Irresistible Offer Box */}
        <div className="px-4 py-5 bg-[#111111]">
          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-5 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#9d6b7c] text-white text-[10px] font-bold py-1 px-4 rounded-bl-xl shadow-md">
              وفر 21% اليوم!
            </div>
            
            <p className="text-xs uppercase font-bold text-gray-400 mb-1">الحل الذكي والأوفر لكِ اليوم:</p>
            <h3 className="text-2xl font-serif text-[#d4af37] flex items-center justify-center gap-2 flex-wrap">
              <span>قطعتين فقط بـ 22 دينار</span>
              <span className="text-xs text-gray-500 font-normal line-through">بدل 28 دينار</span>
            </h3>
            
            {/* Quick value badges */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              <span className="bg-emerald-500/10 text-emerald-400 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                توصيل مجاني لجميع مناطق الأردن
              </span>
              <span className="bg-[#9d6b7c]/20 text-[#9d6b7c] text-[10px] font-bold px-3 py-1 rounded-full border border-[#9d6b7c]/30">
                🔥 العرض الأوفر والأكثر طلباً
              </span>
            </div>

            <div className="mt-4 bg-[#1a1a1a] rounded-xl p-3 border border-white/5 max-w-[95%] mx-auto shadow-sm">
              <p className="text-xs text-amber-400 font-bold flex items-center justify-center gap-1">
                <span>💡 نصيحة: اطلبي قطعتين لتغيير إطلالتك وتوفير 6 دنانير كاملة!</span>
              </p>
            </div>
          </div>
        </div>

        {/* 5. Trust / Conversion Features (Icons & Clear Text) */}
        <div className="bg-[#111111] border-y border-white/5 p-5">
          <h3 className="text-center font-bold text-xs uppercase tracking-widest text-[#9d6b7c] mb-4">لماذا يفضل الأردنيون الشراء منا؟</h3>
          <div className="space-y-4">
            
            <div className="flex items-start gap-3 bg-[#161616] p-4 rounded-xl shadow-sm border border-white/5">
              <div className="w-9 h-9 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">المعاينة والتجربة قبل الدفع والاتفاق</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">افتحي الطرد، وافحصي جودة نسيج الكريب التركي وخامة الستراس اللامعة بنفسك قبل دفع قرش واحد للدليفري.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#161616] p-4 rounded-xl shadow-sm border border-white/5">
              <div className="w-9 h-9 bg-amber-500/10 rounded-full flex items-center justify-center text-[#d4af37] shrink-0">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">مقاسات مريحة وتفصيل دقيق</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">تفصيل انسيابي رائع يناسب وزنك وطولك لغاية وزن 100 كيلو. سنقوم بالتواصل معك لتأكيد أفضل مقاس لك.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#161616] p-4 rounded-xl shadow-sm border border-white/5">
              <div className="w-9 h-9 bg-[#9d6b7c]/15 rounded-full flex items-center justify-center text-[#9d6b7c] shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">ألوان ثابتة وأنيقة لا تتغير</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">كريب تركي عالي الجودة خفيف على الجسم ولا يتجعد بسهولة مع ثبات تام للون الأصلي حتى بعد الغسيل المتكرر.</p>
              </div>
            </div>

          </div>
        </div>

        {/* 6. Color Visual Banner */}
        <div className="p-4 bg-[#111111]">
          <div className="bg-[#161616] rounded-2xl p-4 text-white text-center shadow-lg border border-white/5">
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#d4af37] mb-1">مجموعة الألوان المتوفرة</h4>
            <p className="text-[11px] text-neutral-400">تطريز الستراس الفاخر اللامع على سبعة ألوان ساحرة مستوحاة من الطبيعة</p>
            
            {/* Color Swatch grid */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {COLORS.map((col) => (
                <div 
                  key={col.id} 
                  onClick={() => {
                    setSelectedColor(col);
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center cursor-pointer transition-all ${
                    selectedColor.id === col.id ? 'bg-[#9d6b7c]/20 border-[#9d6b7c]' : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-full shadow-inner border border-white/20" 
                    style={{ backgroundColor: col.hex }}
                  />
                  <span className="text-[10px] font-bold mt-1.5 truncate w-full text-center text-white">{col.name.split(' ')[0]}</span>
                  <span className="text-[8px] text-[#d4af37] font-mono font-bold">{col.code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. Client Reviews / Testimonials Section */}
        <div className="p-5 bg-[#111111] border-t border-white/5">
          <div className="text-center mb-6">
            <span className="bg-[#9d6b7c]/15 text-[#9d6b7c] text-[10px] font-bold px-3 py-1 rounded-full border border-[#9d6b7c]/20 inline-block">
              👑 آراء وتجارب الملكات الحقيقية
            </span>
            <h3 className="text-lg font-black text-white mt-2">ماذا تقول الملكات اللواتي جربن عبايتنا؟</h3>
            <p className="text-[11px] text-neutral-400 mt-1 max-w-[90%] mx-auto">
              تجارب حية وموثقة لعميلاتنا في الأردن مع خامة الكريب التركي والتفصيل الملكي المميز
            </p>

            {/* Overall Rating Score Card */}
            <div className="mt-3 bg-[#161616]/40 border border-white/5 rounded-xl p-3 inline-flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center text-amber-400 gap-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-[10px] text-neutral-400 block mt-0.5">من أصل ٣٢٢ تقييم حقيقي</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-white font-mono">4.9</span>
                <span className="text-xs text-neutral-400 font-bold">/ 5</span>
              </div>
            </div>
          </div>

          {/* Controls Bar: Layout Selector & Filters */}
          <div className="space-y-3 mb-5">
            {/* Layout Toggle Slider */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-[11px] text-neutral-400 font-bold">طريقة عرض التقييمات:</span>
              <div className="bg-[#161616] p-1 rounded-xl border border-white/5 flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setTestimonialLayout('carousel');
                    setTestimonialIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    testimonialLayout === 'carousel'
                      ? 'bg-[#9d6b7c] text-white shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>متتابع (سلايدر)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTestimonialLayout('grid');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    testimonialLayout === 'grid'
                      ? 'bg-[#9d6b7c] text-white shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>الكل (شبكة)</span>
                </button>
              </div>
            </div>

            {/* Filter Chips (Horizontal Scroll) */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar scroll-smooth" style={{ direction: 'rtl' }}>
              {['الكل', 'خامة الكريب', 'تطريز الستراس', 'سرعة التوصيل', 'العرض الأوفر', 'القياس والملاءمة'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setActiveTestimonialTag(tag);
                    setTestimonialIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap border shrink-0 transition-all cursor-pointer ${
                    activeTestimonialTag === tag
                      ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37] shadow-sm shadow-[#d4af37]/5'
                      : 'bg-[#161616] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  {tag === 'الكل' ? '✨ عرض الكل' : tag}
                </button>
              ))}
            </div>
          </div>

          {/* Render Testimonials logic */}
          {(() => {
            const filtered = LANDING_TESTIMONIALS.filter(t => 
              activeTestimonialTag === 'الكل' || t.tag === activeTestimonialTag
            );
            
            const listToRender = filtered.length > 0 ? filtered : LANDING_TESTIMONIALS;
            const currentIndexSafe = testimonialIndex % listToRender.length;
            const activeTestimonial = listToRender[currentIndexSafe];

            if (testimonialLayout === 'carousel') {
              return (
                <div className="relative">
                  {/* Testimonial Active Card */}
                  <div className="bg-[#161616] p-5 rounded-2xl border border-white/5 relative overflow-hidden shadow-xl min-h-[220px] flex flex-col justify-between">
                    {/* Golden Watermark Quote icon */}
                    <Quote className="absolute top-4 left-4 w-12 h-12 text-[#d4af37]/5 pointer-events-none rotate-180 transform" />
                    
                    <div>
                      {/* Card Header Info */}
                      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center ${activeTestimonial.avatarColor}`}>
                            {activeTestimonial.initials}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs text-white block">{activeTestimonial.name}</h4>
                            <span className="text-[9px] text-neutral-500 block mt-0.5">{activeTestimonial.date}</span>
                          </div>
                        </div>

                        <div className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-500/20 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>زبونة مؤكدة 👑</span>
                        </div>
                      </div>

                      {/* Stars & Tag Badge */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center text-amber-400 gap-0.5">
                          {[...Array(activeTestimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="bg-[#9d6b7c]/10 text-[#9d6b7c] border border-[#9d6b7c]/20 text-[9px] font-bold px-2 py-0.5 rounded-md">
                          🏷️ {activeTestimonial.tag}
                        </span>
                      </div>

                      {/* Comment text */}
                      <p className="text-xs text-neutral-200 mt-3.5 leading-relaxed relative z-10 font-medium">
                        "{activeTestimonial.comment}"
                      </p>
                    </div>

                    {/* Left/Right Floating buttons in RTL */}
                    <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setTestimonialIndex(prev => (prev + 1) % listToRender.length)}
                        className="w-8 h-8 bg-neutral-950/60 hover:bg-neutral-800 text-neutral-300 rounded-xl flex items-center justify-center border border-white/5 cursor-pointer transition-colors"
                        title="المراجعة التالية"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Dot indicators */}
                      <div className="flex gap-1.5">
                        {listToRender.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setTestimonialIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              currentIndexSafe === idx ? 'bg-[#d4af37] w-4' : 'bg-neutral-700 hover:bg-neutral-500'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setTestimonialIndex(prev => (prev - 1 + listToRender.length) % listToRender.length)}
                        className="w-8 h-8 bg-neutral-950/60 hover:bg-neutral-800 text-neutral-300 rounded-xl flex items-center justify-center border border-white/5 cursor-pointer transition-colors"
                        title="المراجعة السابقة"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            } else {
              // Grid Layout
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listToRender.map((rev) => (
                    <div key={rev.id} className="bg-[#161616] p-4 rounded-xl border border-white/5 flex flex-col justify-between shadow-md">
                      <div>
                        <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center ${rev.avatarColor}`}>
                              {rev.initials}
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-white block">{rev.name}</h4>
                              <span className="text-[9px] text-neutral-500 block">{rev.date}</span>
                            </div>
                          </div>
                          <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-500/10">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>مؤكدة</span>
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center text-amber-400 gap-0.5">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                          <span className="text-[8px] text-[#9d6b7c] font-bold">
                            #{rev.tag}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-300 mt-2.5 leading-relaxed font-medium">
                          "{rev.comment}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
          })()}

          {/* Social Proof conversion boost sub-banner */}
          <div className="mt-4 bg-[#d4af37]/5 border border-[#d4af37]/10 rounded-xl p-3 text-center">
            <span className="text-[10px] text-amber-300 font-extrabold block">
              💡 هل تعلمين؟ 94% من العميلات يخترن "عرض قطعتين بـ 22 دينار" لتوفير 6 دنانير وإهداء قطعة للأخت أو الصديقة! 🎁
            </span>
          </div>
        </div>

        {/* 7.5. Interactive Video Player Section Showcase */}
        <div className="p-4 bg-[#111111]">
          <div className="bg-[#161616] rounded-2xl p-4 text-white shadow-lg border border-white/5">
            <div className="text-center mb-3">
              <span className="bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#d4af37]/20 inline-block">
                ✨ فيديو توضيحي للعرض الفعلي
              </span>
              <h3 className="text-sm font-extrabold text-white mt-1.5">شاهدي العباية على الطبيعة قبل الطلب</h3>
              <p className="text-[10px] text-neutral-400 mt-0.5">تفاصيل دقيقة تسحر القلوب تظهر حركة القماش وانسيابيته الملكية</p>
            </div>

            {/* Premium Video Player */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 shadow-inner bg-black flex flex-col justify-center items-center">
              <video 
                className="w-full h-full object-cover"
                controls
                playsInline
                loop
                muted
                poster="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800"
              >
                {/* Placeholder URL - Can be customized by the merchant later */}
                <source src="https://assets.mixkit.co/videos/preview/mixkit-elegant-woman-wearing-a-traditional-black-robe-with-gold-elements-43340-large.mp4" type="video/mp4" />
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                متصفحك لا يدعم تشغيل الفيديو.
              </video>
              
              {/* Fallback & Custom overlay description */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[9px] text-amber-300 flex items-center justify-between border border-white/5">
                <span>📹 خامة كريب تركي أصلي 100%</span>
                <span>تطريز يدوي ستراس لامع ✨</span>
              </div>
            </div>

            <div className="mt-2 text-center">
              <span className="text-[10px] text-neutral-400">
                💡 انقري على زر التشغيل لرؤية لمعة الستراس وانسيابية العباية أثناء الحركة
              </span>
            </div>
          </div>
        </div>

        {/* 8. Super Secure Arabic Order Form */}
        <div ref={formRef} className="bg-[#fdfafb] text-[#111111] rounded-t-[30px] p-6 mt-6 shadow-2xl relative border-t-4 border-[#9d6b7c]" id="order-form-container">
          <div className="text-center mb-5">
            <span className="bg-[#9d6b7c]/15 text-[#9d6b7c] text-xs font-bold px-3 py-1 rounded-full border border-[#9d6b7c]/20 inline-block mb-2">
              🛒 الدفع نقداً عند استلام الطرد وتجربته
            </span>
            <h2 className="text-xl font-bold text-[#9d6b7c]">تأكيد الطلب السريع</h2>
            <p className="text-xs text-neutral-500 mt-1 max-w-[85%] mx-auto leading-relaxed">
              الرجاء تعبئة البيانات التالية بدقة، وسيتم التواصل معك هاتفياً لتأكيد المقاس واللون المفضل.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Form Error Message */}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3 rounded-xl font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">الاسم الكامل للمستلم *</label>
              <div className="relative">
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pr-10 pl-3 text-sm text-neutral-900 focus:outline-none focus:border-[#9d6b7c] focus:ring-1 focus:ring-[#9d6b7c] transition-all"
                  placeholder="مثال: رانيا أحمد"
                  required
                  id="input-customer-name"
                />
                <User className="absolute top-3.5 right-3 w-4 h-4 text-neutral-400" />
              </div>
            </div>

            {/* Mobile Phone */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">رقم الهاتف الأساسي *</label>
              <div className="relative">
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pr-10 pl-3 text-sm text-neutral-900 font-mono focus:outline-none focus:border-[#9d6b7c] focus:ring-1 focus:ring-[#9d6b7c] transition-all"
                  placeholder="07XXXXXXXX"
                  required
                  id="input-customer-phone"
                />
                <Phone className="absolute top-3.5 right-3 w-4 h-4 text-neutral-400" />
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">يجب أن يبدأ بـ 07 ويتكون من 10 أرقام لنتمكن من تأكيد طلبك.</p>
            </div>

            {/* Offer Selection Cards */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2">العرض المطلوب *</label>
              <div className="space-y-2">
                {OFFERS.map((off) => (
                  <label 
                    key={off.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedOffer === off.title 
                        ? 'bg-[#9d6b7c]/10 border-[#9d6b7c] text-neutral-900 shadow-sm' 
                        : 'bg-white border-gray-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="offer" 
                        value={off.title}
                        checked={selectedOffer === off.title}
                        onChange={() => setSelectedOffer(off.title)}
                        className="accent-[#9d6b7c] w-4 h-4 cursor-pointer"
                      />
                      <div className="text-right">
                        <span className="text-xs font-bold block text-neutral-800">{off.title.split(' (')[0]}</span>
                        {off.savings && <span className="text-[10px] text-emerald-600 font-bold">{off.savings}</span>}
                      </div>
                    </div>
                    <div className="text-left shrink-0">
                      <span className="text-sm font-extrabold text-[#9d6b7c]">{off.price} دينار</span>
                      {off.oldPrice && (
                        <span className="text-[10px] text-gray-400 line-through block">{off.oldPrice} د.أ</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Selected Color Visual */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">اللون الأساسي المطلوب *</label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {COLORS.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all text-right ${
                      selectedColor.id === col.id 
                        ? 'bg-[#9d6b7c]/10 border-[#9d6b7c] text-[#9d6b7c] font-bold' 
                        : 'bg-white border-gray-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                    id={`btn-color-select-${col.id}`}
                  >
                    <span 
                      className="w-4 h-4 rounded-full shadow-inner shrink-0 border border-black/10" 
                      style={{ backgroundColor: col.hex }}
                    />
                    <div className="truncate">
                      <span className="text-xs font-bold block text-neutral-800">{col.name.split(' ')[0]}</span>
                      <span className="text-[9px] text-neutral-500 block font-mono">{col.code}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Height and Weight Parameters */}
            <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
              {/* Weight */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-neutral-400" />
                  <span>الوزن التقريبي (كغم) *</span>
                </label>
                <div className="flex items-center gap-1.5 mt-1">
                  <button 
                    type="button"
                    onClick={() => setWeight(prev => Math.max(40, prev - 2))}
                    className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center font-bold text-sm text-neutral-700 cursor-pointer"
                  >
                    -
                  </button>
                  <input 
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Math.min(110, Math.max(30, Number(e.target.value))))}
                    className="w-12 bg-neutral-50 border border-gray-200 text-center py-1 rounded-lg text-xs font-bold font-mono focus:outline-none"
                    min="30"
                    max="110"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setWeight(prev => Math.min(110, prev + 2))}
                    className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center font-bold text-sm text-neutral-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-neutral-400" />
                  <span>الطول التقريبي (سم) *</span>
                </label>
                <div className="flex items-center gap-1.5 mt-1">
                  <button 
                    type="button"
                    onClick={() => setHeight(prev => Math.max(130, prev - 2))}
                    className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center font-bold text-sm text-neutral-700 cursor-pointer"
                  >
                    -
                  </button>
                  <input 
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Math.min(200, Math.max(120, Number(e.target.value))))}
                    className="w-12 bg-neutral-50 border border-gray-200 text-center py-1 rounded-lg text-xs font-bold font-mono focus:outline-none"
                    min="120"
                    max="200"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setHeight(prev => Math.min(200, prev + 2))}
                    className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center font-bold text-sm text-neutral-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">المحافظة والعنوان بالتفصيل *</label>
              <div className="relative">
                <input 
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pr-10 pl-3 text-sm text-neutral-900 focus:outline-none focus:border-[#9d6b7c] focus:ring-1 focus:ring-[#9d6b7c] transition-all"
                  placeholder="مثال: عمان - مرج الحمام - قرب دوار الدلة"
                  required
                  id="input-customer-address"
                />
                <MapPin className="absolute top-3.5 right-3 w-4 h-4 text-neutral-400" />
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">اسم المحافظة، الحي، اسم الشارع، وأي معلم بارز قريب لتسهيل وسرعة الشحن.</p>
            </div>

            {/* Payment Method Option - Cash on Delivery */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>طريقة الدفع المتاحة *</span>
              </label>
              
              <div className="p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-neutral-900 block">الدفع عند الاستلام (Cash on Delivery)</span>
                    <span className="text-[11px] text-emerald-700 font-medium">افحصي عبايتكِ وجربيها قبل الدفع!</span>
                  </div>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">
                  مفعّل ومجاني
                </span>
              </div>
              
              <div className="mt-3 bg-neutral-50 rounded-lg p-2.5 border border-dashed border-gray-200 text-[11px] text-neutral-500 leading-relaxed">
                ℹ️ <strong className="text-neutral-800">تعليمات الدفع:</strong> بموجب سياسة التوصيل الخاصة بنا، لا يتوجب عليكِ دفع أي مبالغ مسبقة. عند وصول مندوب شركة الشحن، يمكنكِ فتح الطرد ومعاينة جودة قماش الكريب التركي وتفصيل الستراس الملكي بنفسك، ثم تسليم المبلغ نقداً (كاش) للمندوب فقط في حال نالت العباية رضاكِ الكامل.
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-[#111111] hover:bg-black text-[#d4af37] font-extrabold text-base md:text-lg py-4 px-6 rounded-xl cursor-pointer shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
              id="btn-order-submit"
            >
              <ShoppingBag className="w-5 h-5 shrink-0" />
              <span>اضغطي هنا لتأكيد الطلب 🛒</span>
            </button>

            {/* Fallback trust indicators below form */}
            <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-6 border-t border-gray-200 mt-6">
              <div className="flex items-center space-x-reverse space-x-4">
                <span>✓ فحص عند الاستلام</span>
                <span>✓ جودة كريب تركي</span>
              </div>
              <div className="text-[#9d6b7c]">LIMITED QUANTITY AVAILABLE</div>
            </div>

          </form>
        </div>

        {/* 9. Footer Terms */}
        <footer className="bg-[#111111] text-neutral-400 py-6 text-center px-4 text-[10px] border-t border-white/5">
          <p>© {new Date().getFullYear()} دار الملكة للعبايات الفاخرة. جميع الحقوق محفوظة.</p>
          <p className="mt-1 text-neutral-500">هذه الصفحة مشفرة وآمنة لتلقي طلبات المبيعات بكفاءة وسرعة فائقة.</p>
        </footer>

      </div>

      {/* 10. Sticky / Floating Buy Button (Visible on mobile screens as they scroll) */}
      <div className="fixed bottom-0 inset-x-0 p-3 bg-neutral-900/90 backdrop-blur-md border-t border-white/5 z-30 flex justify-center sm:hidden">
        <a 
          href="#order-form-container" 
          onClick={scrollToForm}
          className="w-full max-w-[450px] bg-[#d4af37] text-black text-center font-extrabold py-3 px-4 rounded-xl text-xs tracking-wider uppercase shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-transform"
        >
          <ShoppingBag className="w-4.5 h-4.5 shrink-0" />
          <span>اضغطي هنا لتأكيد الطلب 🛒</span>
        </a>
      </div>

    </div>
  );
}
