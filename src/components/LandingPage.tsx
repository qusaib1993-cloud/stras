/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { OFFERS, COLORS, REVIEWS } from '../data';
import { ColorOption, Offer, Order } from '../types';
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
  MessageSquare,
  Search,
  Package,
  AlertCircle,
  X
} from 'lucide-react';

const JORDAN_CITIES = [
  'عمان',
  'إربد',
  'الزرقاء',
  'البلقاء',
  'العقبة',
  'مأدبا',
  'جرش',
  'عجلون',
  'المفرق',
  'الكرك',
  'الطفيلة',
  'معان'
];

const getRecommendedSize = (h: number) => {
  if (h < 153) return '132';
  if (h < 159) return '137';
  if (h < 165) return '142';
  if (h < 171) return '147';
  return '152';
};

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
  orders?: Order[];
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

export default function LandingPage({ onOrderSubmit, onGoToDashboard, orders = [] }: LandingPageProps) {
  // Tracking states
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingResults, setTrackingResults] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(OFFERS[0].title);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(160);
  const [selectedLength, setSelectedLength] = useState('142');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('عمان');
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

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError('');
    setHasSearched(true);

    const query = trackingInput.trim().toUpperCase();
    if (!query) {
      setTrackingError('يرجى إدخال رقم الطلب أو رقم الهاتف للبحث.');
      setTrackingResults([]);
      return;
    }

    // Load latest orders from localStorage as fallback/primary to ensure real-time lookup
    let currentOrders = orders;
    try {
      const saved = localStorage.getItem('hekaya_khait_orders');
      if (saved) {
        currentOrders = JSON.parse(saved);
      }
    } catch (err) {
      // fallback
    }

    const cleanPhoneQuery = query.replace(/[\s-()]/g, '');

    const found = currentOrders.filter(o => {
      const orderId = o.id.toUpperCase();
      const orderPhone = o.phone.replace(/[\s-()]/g, '');
      
      const matchesId = orderId === query || orderId === `ORD-${query}` || orderId.endsWith(query);
      const matchesPhone = cleanPhoneQuery.length >= 6 && (orderPhone.includes(cleanPhoneQuery) || cleanPhoneQuery.includes(orderPhone));

      return matchesId || matchesPhone;
    });

    if (found.length === 0) {
      setTrackingError('عذراً، لم نتمكن من العثور على أي طلب يطابق البيانات المدخلة. يرجى التأكد من الرقم والمحاولة مرة أخرى.');
      setTrackingResults([]);
    } else {
      setTrackingResults(found);
    }
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
      address: `${city} - ${address}`
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
        <header className="bg-[#4c6442] py-2.5 px-4 text-center sticky top-0 z-40 text-white font-extrabold text-xs shadow-md">
          <div className="flex items-center justify-center gap-1.5">
            <Flame className="w-4 h-4 text-white animate-pulse" />
            <span>🔥 عرض حرق الأسعار لفترة محدودة جداً + توصيل مجاني لباب البيت 👀</span>
            <div className="flex gap-1 font-mono text-white bg-black/30 px-1.5 py-0.5 rounded text-[10px] font-black mr-1">
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="animate-pulse">:</span>
              <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </header>

        {/* 2. Premium Brand Header with Horizontal Logo */}
        <div className="bg-[#111111] relative pt-6 pb-4 text-center text-white border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#875667]/15 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center">
            {/* Horizontal Brand Logo */}
            <div className="mb-3">
              <img 
                src="/logo-horizontal.png" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallbackLabel = document.getElementById('brand-fallback-label');
                  if (fallbackLabel) fallbackLabel.style.display = 'block';
                }}
                className="max-h-12 mx-auto object-contain px-4" 
                alt="حكاية خيط للعبايات"
              />
              <div id="brand-fallback-label" style={{ display: 'none' }} className="inline-block px-4 py-1 border border-[#849a71] text-[#849a71] text-[10px] tracking-[0.2em] uppercase rounded-sm font-semibold">
                HEKAYA KHAIT
              </div>
            </div>
            
            <h1 className="text-xl font-extrabold px-4 tracking-tight leading-normal text-white">
              عباية الستراس <span className="text-[#875667] italic font-normal text-base block mt-0.5">حكاية خيط للأناقة الفاخرة</span>
            </h1>
            <p className="text-[11px] text-neutral-400 mt-1 max-w-[85%] mx-auto leading-relaxed">
              خامة كريب تركي ناعمة ومريحة جداً تناسب حركتك اليومية وتمنحك الأناقة الكاملة بـ 7 ألوان ساحرة.
            </p>
          </div>
        </div>

        {/* 2.5 Hero Image / Banner Showcase */}
        <div className="p-4 bg-[#111111] border-b border-white/5">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[16/9] bg-neutral-900">
            <img 
              src="/color-c1.webp" 
              onError={(e) => {
                e.currentTarget.src = "/IMG_6453.webp";
              }}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              alt="عباية الستراس الفاخرة - البنر الإعلاني"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
              <span className="bg-[#875667] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-md w-fit mb-1 shadow-md">
                ✨ عرض حرق الأسعار - الأكثر مبيعاً
              </span>
              <h2 className="text-sm font-extrabold text-[#849a71] leading-snug drop-shadow-md">
                تصميم ملكي فاخر يمنحك التميز والأناقة الكاملة
              </h2>
              <p className="text-[10px] text-neutral-300 mt-0.5 leading-relaxed drop-shadow">
                تفصيل انسيابي رائع بنسيج كريب تركي عالي الجودة ناعم وخفيف ومريح لكل يوم!
              </p>
            </div>
          </div>
        </div>

        {/* 2.6 Track My Order lookup section */}
        <div className="p-4 bg-[#111111] border-b border-white/5" id="order-tracking-section">
          <div className="bg-[#161616] rounded-2xl p-4 md:p-5 border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 bg-[#875667]/10 text-[#875667] text-[9px] font-black py-1 px-3.5 rounded-br-xl uppercase tracking-wider">
              خدمة العملاء 📦
            </div>
            
            <h3 className="text-xs font-black text-white mb-2 flex items-center gap-1.5 pt-1">
              <Package className="w-4 h-4 text-[#849a71]" />
              <span>تتبّع حالة طلبكِ مباشرة:</span>
            </h3>
            
            <p className="text-[10px] text-neutral-400 mb-3 leading-relaxed">
              أدخلي رقم الطلب الخاص بكِ (مثال: ORD-1234) أو رقم هاتف المستلم لمشاهدة حالة الشحن الفورية للعباية دون الحاجة لتسجيل دخول.
            </p>

            <form onSubmit={handleTrackOrder} className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="رقم الطلب (ORD-xxxx) أو رقم الهاتف..."
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="w-full bg-[#111111] border border-neutral-800 focus:border-[#875667] focus:outline-none rounded-xl py-2 pr-9 pl-3 text-xs font-bold text-white placeholder-neutral-500 text-right"
                />
              </div>
              <button
                type="submit"
                className="bg-[#875667] hover:bg-[#724454] text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 shadow-lg cursor-pointer transition-all flex items-center gap-1.5"
              >
                <span>تتبع</span>
              </button>
            </form>

            {/* Error Message */}
            {hasSearched && trackingError && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[10px] flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{trackingError}</span>
              </div>
            )}

            {/* Results Display */}
            {hasSearched && trackingResults.length > 0 && (
              <div className="mt-4 p-3.5 bg-[#111111] border border-[#849a71]/20 rounded-xl relative">
                <button
                  type="button"
                  onClick={() => {
                    setHasSearched(false);
                    setTrackingResults([]);
                    setTrackingInput('');
                  }}
                  className="absolute top-2.5 left-2.5 text-neutral-500 hover:text-white p-1 rounded-full bg-[#161616] border border-neutral-800 cursor-pointer"
                  title="إغلاق التتبع"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <h4 className="text-[11px] font-extrabold text-emerald-400 mb-3 flex items-center gap-1 text-right">
                  <span>تم العثور على ({trackingResults.length}) طلب:</span>
                </h4>

                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {trackingResults.map((order) => {
                    const statusText = 
                      order.status === 'pending' ? 'قيد الانتظار والمعاينة' :
                      order.status === 'confirmed' ? 'تم تأكيد الطلب والتجهيز' :
                      order.status === 'shipped' ? 'جاري التوصيل مع المندوب' :
                      'تم إلغاء الطلب';
                    
                    const statusDesc = 
                      order.status === 'pending' ? 'طلبكِ قيد المراجعة والتحضير، سيتصل بكِ فريق العمل قريباً لتأكيد المقاس والتوصيل.' :
                      order.status === 'confirmed' ? 'تم تأكيد طلبكِ بنجاح! نقوم الآن بتجهيز وتغليف عبايتكِ بعناية تامة في مستودعاتنا.' :
                      order.status === 'shipped' ? 'تم تسليم الطلب لشركة الشحن، المندوب في طريقه إليكِ وسيتصل بكِ خلال ساعات.' :
                      'تم إلغاء هذا الطلب. يرجى التواصل معنا إذا كان هناك أي استفسار.';

                    const statusColor = 
                      order.status === 'pending' ? 'text-amber-400' :
                      order.status === 'confirmed' ? 'text-blue-400' :
                      order.status === 'shipped' ? 'text-emerald-400' :
                      'text-red-400';

                    const statusBg = 
                      order.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20' :
                      order.status === 'confirmed' ? 'bg-blue-500/10 border-blue-500/20' :
                      order.status === 'shipped' ? 'bg-emerald-500/10 border-emerald-500/20' :
                      'bg-red-500/10 border-red-500/20';

                    // Parse order date safely
                    let dateStr = '';
                    try {
                      dateStr = new Date(order.date).toLocaleDateString('ar-JO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                    } catch (e) {
                      dateStr = order.date;
                    }

                    return (
                      <div key={order.id} className="p-3 bg-[#161616] rounded-xl border border-white/5 text-[11px] space-y-2.5 text-right">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="font-mono font-black text-neutral-300 text-xs">{order.id}</span>
                          <span className="text-[10px] text-neutral-400">{dateStr}</span>
                        </div>

                        {/* Order info details */}
                        <div className="grid grid-cols-2 gap-y-1.5 text-[10px] text-neutral-300 pb-1 border-b border-white/5 text-right">
                          <div><span className="text-neutral-500">اسم المستلم:</span> <span className="font-extrabold">{order.name}</span></div>
                          <div><span className="text-neutral-500">العرض:</span> <span className="text-[#849a71] font-bold">{order.offer}</span></div>
                          <div><span className="text-neutral-500">اللون:</span> <span className="font-bold">{order.color}</span></div>
                          <div><span className="text-neutral-500">الطول (سم):</span> <span className="font-mono font-bold">{order.height}</span></div>
                          <div className="col-span-2"><span className="text-neutral-500">العنوان:</span> <span>{order.address}</span></div>
                          <div className="col-span-2"><span className="text-neutral-500">قيمة الفاتورة:</span> <span className="text-emerald-400 font-extrabold text-xs">{order.totalPrice} دينار أردني</span></div>
                        </div>

                        {/* Progress Status Timeline */}
                        <div className={`p-2.5 rounded-lg border ${statusBg}`}>
                          <div className="flex items-center gap-1.5 justify-start">
                            <span className="relative flex h-2 w-2">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${order.status === 'shipped' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${order.status === 'shipped' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            </span>
                            <span className={`font-extrabold ${statusColor}`}>حالة الطلب: {statusText}</span>
                          </div>
                          <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">{statusDesc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
            <div className="absolute top-2 right-2 flex gap-1 text-[10px] text-[#849a71] font-bold bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm border border-[#849a71]/20">
              <Sparkles className="w-3 h-3 text-[#849a71]" />
              <span>معاينة حية للون</span>
            </div>

            {/* Real Model Photo - changes dynamically based on selectedColor */}
            <div className="w-full max-w-[280px] aspect-[3/4] relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.8)] bg-neutral-900 group">
              <img 
                key={selectedColor.id} // Forces React to recreate the element for clean transition animation
                src={selectedColor.image} 
                onError={(e) => {
                  e.currentTarget.src = "/IMG_6453.webp";
                }}
                className="w-full h-full object-cover transition-all duration-700 scale-100 hover:scale-105" 
                alt={`عباية الستراس الفاخرة باللون ${selectedColor.name}`}
              />
              
              {/* Premium Luxury Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 pointer-events-none text-right">
                <span className="text-[9px] text-neutral-300 font-bold tracking-wider mb-0.5">تصوير حقيقي ومباشر 📸</span>
                <span className="text-xs font-black text-[#849a71]">{selectedColor.name}</span>
              </div>
            </div>

            {/* Live Color Label */}
            <div className="mt-3 text-center z-10">
              <span className="text-white text-sm font-semibold block">{selectedColor.name}</span>
              <span className="text-[11px] text-[#849a71] font-mono mt-0.5 inline-block bg-[#849a71]/10 px-2 py-0.5 rounded border border-[#849a71]/20">
                كود القماش التركي: {selectedColor.code}
              </span>
            </div>

            {/* Quick interactive color switcher circles right on the product viewer */}
            <div className="flex flex-wrap justify-center gap-2.5 mt-4 z-10 max-w-[90%]">
              {COLORS.map((col) => {
                const isDarkColor = col.id === 'black' || col.id === 'charcoal' || col.id === 'green' || col.id === 'burgundy';
                const textClass = isDarkColor ? 'text-white/90' : 'text-neutral-900/90';
                return (
                  <button
                    key={col.id}
                    onClick={() => setSelectedColor(col)}
                    className={`w-9 h-9 rounded-full border-2 transition-all duration-300 relative flex flex-col items-center justify-center shadow-lg cursor-pointer ${
                      selectedColor.id === col.id 
                        ? 'border-emerald-500 scale-110 ring-2 ring-emerald-500/20' 
                        : 'border-neutral-700/60 hover:scale-105'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                    id={`color-picker-${col.id}`}
                  >
                    <span className={`text-[10px] font-black tracking-tight ${textClass}`}>
                      {col.code}
                    </span>
                    {selectedColor.id === col.id && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                    )}
                  </button>
                );
              })}
            </div>

          </div>
          <p className="text-[11px] text-neutral-400 text-center mt-2.5">
            💡 اضغطي على الدوائر الملونة لرؤية العباية على الطبيعة بلونها المفضل!
          </p>

          {/* Premium Delivery & Inspection Trust Policy */}
          <div className="mt-5 p-4 bg-[#161616] border border-[#849a71]/30 rounded-2xl text-right relative overflow-hidden shadow-lg" id="delivery-inspection-policy-box">
            <div className="absolute top-0 left-0 bg-[#849a71]/20 text-[#849a71] text-[9px] font-black py-1 px-3.5 rounded-br-xl uppercase tracking-wider">
              سياسة الفحص الآمن 🛡️
            </div>
            <h4 className="text-xs font-black text-[#849a71] mb-3 flex items-center gap-1.5 pt-1">
              <span>شروط الفحص والتوصيل لمشترياتكِ:</span>
            </h4>
            <ul className="space-y-2.5 text-[11px] leading-relaxed text-neutral-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                <span>المنتج سيكون بحوزتكِ بالكامل، مع الحق المطلق في فتح الطرد ومعاينته بالكامل قبل الدفع.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                <span>لكِ الحق في فتح الطرد والتحقق من جودة الكريب والستراس دون قياس مسبق في الموقع.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                <span>تركيزنا التام هو على استلامكِ للطلب برضا كامل، وفي حال وجود أي تفاوت بالقياس فإن <strong>الاستبدال مجاني بالكامل والشحن مجاني بالكامل على حسابنا</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                <span>يرجى العلم بأن الفحص البصري للمنتج مشمول ومتاح، بينما لا تشمل الخدمة التجربة الفعلية (الارتداء والبروفة في الموقع).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                <span>سيتم تسليم الطلب وتوصيله إليكِ بالكامل خلال يومين إلى ثلاثة أيام، وسيقوم المندوب بالتواصل معكِ مسبقاً لتنسيق الموعد.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Irresistible Offer Box (Upsell Showcase) */}
        <div className="px-4 py-5 bg-[#111111]">
          <div className="bg-gradient-to-br from-[#1d1d1d] to-[#121212] border border-white/10 rounded-2xl p-5 text-center relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 bg-[#9d6b7c] text-white text-[10px] font-bold py-1 px-4 rounded-bl-xl shadow-md">
              خصم خاص اليوم!
            </div>
            
            <p className="text-xs uppercase font-bold text-gray-400 mb-1">الحل الذكي والأوفر لكِ اليوم:</p>
            
            {/* Visual Grid Comparison */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {/* Option 1: One Piece */}
              <div className="bg-[#1a1a1a] border border-white/5 p-3 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-bold mb-1">الخيار الفردي</span>
                  <h4 className="text-xs font-black text-white leading-tight">قطعة واحدة فقط</h4>
                </div>
                <div className="mt-3">
                  <span className="text-base font-black text-neutral-300 font-mono">14 دينار</span>
                  <p className="text-[9px] text-neutral-500 block mt-0.5">سعر القطعة: 14 د.أ</p>
                </div>
              </div>

              {/* Option 2: Two Pieces (Upsell Winner) */}
              <div className="bg-[#875667]/15 border-2 border-[#875667] p-3 rounded-xl flex flex-col justify-between relative shadow-inner">
                <span className="absolute -top-2.5 inset-x-0 mx-auto w-fit bg-[#4c6442] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full shadow">
                  أوفر بـ 6 دنانير! 🎁
                </span>
                <div className="pt-1.5">
                  <span className="text-[10px] text-[#875667] block font-extrabold mb-1">العرض الأكثر مبيعاً 🔥</span>
                  <h4 className="text-xs font-black text-white leading-tight">قطعتين كاملتين</h4>
                </div>
                <div className="mt-3">
                  <span className="text-base font-black text-[#849a71] font-mono">22 دينار</span>
                  <p className="text-[9px] text-emerald-400 font-extrabold block mt-0.5">بدل <span className="line-through text-neutral-500">28 د.أ</span></p>
                </div>
              </div>
            </div>
            
            {/* Quick value badges */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-4">
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                توصيل مجاني لجميع مناطق الأردن لباب البيت
              </span>
            </div>

            <div className="mt-3.5 bg-neutral-900 rounded-xl p-2.5 border border-white/5 max-w-[95%] mx-auto">
              <p className="text-[11px] text-[#849a71] font-bold flex items-center justify-center gap-1">
                <span>💡 نصيحة حكاية خيط: اطلبي قطعتين (مثال: الأسود الملكي + الوردي العتيق) لتوفير 6 دنانير والحصول على إطلالة بديلة ساحرة!</span>
              </p>
            </div>
          </div>
        </div>

        {/* 5. Trust / Conversion Features (Icons & Clear Text) with Circular Stamp */}
        <div className="bg-[#111111] border-y border-white/5 p-5">
          {/* Circular Guarantee Stamp Card */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#131313] border border-[#849a71]/30 rounded-2xl p-4 flex items-center gap-4 shadow-xl mb-6">
            <div className="relative shrink-0">
              <img 
                src="/logo-circular.png" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallbackSeal = document.getElementById('seal-fallback-badge');
                  if (fallbackSeal) fallbackSeal.style.display = 'flex';
                }}
                className="w-16 h-16 object-contain" 
                alt="ختم الثقة حكاية خيط"
              />
              <div id="seal-fallback-badge" style={{ display: 'none' }} className="w-16 h-16 rounded-full bg-[#849a71]/10 border border-[#849a71]/30 items-center justify-center text-[#849a71] font-bold text-center text-xs flex-col">
                <span className="text-sm">✓</span>
                <span className="text-[8px]">ضمان</span>
              </div>
            </div>
            <div className="text-right">
              <h4 className="text-xs font-black text-[#849a71] tracking-wider uppercase">ضمان الفحص قبل الاستلام والدفع</h4>
              <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
                المعاينة متاحة بالكامل قبل الاستلام والدفع. افحصي جودة قماش الكريب التركي وخياطة الستراس اللامعة بنفسك قبل الدفع!
              </p>
            </div>
          </div>

          <h3 className="text-center font-bold text-xs uppercase tracking-widest text-[#875667] mb-4">لماذا يفضل الأردنيون الشراء منا؟</h3>
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
              <div className="w-9 h-9 bg-amber-500/10 rounded-full flex items-center justify-center text-[#849a71] shrink-0">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">مقاسات مريحة وتفصيل دقيق</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">تفصيل انسيابي رائع يناسب وزنك وطولك لغاية وزن 100 كيلو. سنقوم بالتواصل معك لتأكيد أفضل مقاس لك.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#161616] p-4 rounded-xl shadow-sm border border-white/5">
              <div className="w-9 h-9 bg-[#875667]/15 rounded-full flex items-center justify-center text-[#875667] shrink-0">
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
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#849a71] mb-1">مجموعة الألوان المتوفرة</h4>
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
                    selectedColor.id === col.id ? 'bg-[#875667]/20 border-[#875667]' : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-full shadow-inner border border-white/20" 
                    style={{ backgroundColor: col.hex }}
                  />
                  <span className="text-[10px] font-bold mt-1.5 truncate w-full text-center text-white">{col.name.split(' ')[0]}</span>
                  <span className="text-[8px] text-[#849a71] font-mono font-bold">{col.code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6.5. Color Catalog & Texture Section */}
        <div className="p-4 bg-[#111111] border-b border-white/5">
          <div className="bg-[#161616] rounded-2xl p-5 shadow-lg border border-white/5">
            <div className="text-center mb-5">
              <span className="bg-[#875667]/15 text-[#875667] text-[10px] font-bold px-3 py-1 rounded-full border border-[#875667]/20 inline-block">
                📸 المعرض الحقيقي للألوان السبعة الفاخرة للعباية
              </span>
              <h3 className="text-sm font-extrabold text-white mt-2">اضغطي على أي لون لتغيير صورة الموديل وتحديده فوراً</h3>
              <p className="text-[10px] text-neutral-400 mt-1">
                الصور الحقيقية للعباية من الواقع لضمان الشفافية والأمانة الكاملة في تفصيل طلبكِ.
              </p>
            </div>

            {/* Grid of the 7 original colors */}
            <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
              {COLORS.map((col) => {
                const isSelected = selectedColor.id === col.id;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`relative rounded-xl overflow-hidden border transition-all duration-300 text-right group flex flex-col ${
                      isSelected 
                        ? 'border-[#849a71] ring-2 ring-[#849a71]/50 scale-102 bg-[#849a71]/5' 
                        : 'border-white/5 bg-neutral-900/40 hover:border-white/20'
                    }`}
                  >
                    {/* The model image representing this color */}
                    <div className="aspect-[3/4] w-full overflow-hidden relative bg-black">
                      <img 
                        src={col.image}
                        onError={(e) => {
                          e.currentTarget.src = "/IMG_6453.webp";
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        alt={col.name}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-[#849a71] text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-md">
                            ✓ تم الاختيار
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Color Label */}
                    <div className="p-2 flex flex-col justify-between flex-1 bg-neutral-950/60">
                      <span className="text-[10px] font-extrabold text-white truncate block">{col.name.split(' ')[0]}</span>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[9px] text-neutral-400 font-mono">{col.code}</span>
                        <span 
                          className="w-2.5 h-2.5 rounded-full border border-white/20" 
                          style={{ backgroundColor: col.hex }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-center bg-[#849a71]/5 border border-[#849a71]/10 p-2.5 rounded-xl">
              <p className="text-[10px] text-[#849a71] font-bold leading-relaxed">
                ✨ جميع هذه الصور حقيقية ومصورة للعباية من الواقع لضمان مطابقة تفصيل خامة الكريب المنسدل وتطريز الستراس 100%.
              </p>
            </div>
          </div>
        </div>

        {/* 7. Client Reviews / Testimonials Section */}
        <div className="p-5 bg-[#111111] border-t border-white/5">
          <div className="text-center mb-6">
            <span className="bg-[#875667]/15 text-[#875667] text-[10px] font-bold px-3 py-1 rounded-full border border-[#875667]/20 inline-block">
              👑 آراء وتجارب عميلاتنا الحقيقية
            </span>
            <h3 className="text-lg font-black text-white mt-2">ماذا تقول العميلات اللواتي جربن عبايتنا؟</h3>
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
                      ? 'bg-[#849a71]/10 border-[#849a71] text-[#849a71] shadow-sm shadow-[#849a71]/5'
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
                    <Quote className="absolute top-4 left-4 w-12 h-12 text-[#849a71]/5 pointer-events-none rotate-180 transform" />
                    
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
                              currentIndexSafe === idx ? 'bg-[#849a71] w-4' : 'bg-neutral-700 hover:bg-neutral-500'
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
                          <span className="text-[8px] text-[#875667] font-bold">
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
          <div className="mt-4 bg-[#849a71]/5 border border-[#849a71]/10 rounded-xl p-3 text-center">
            <span className="text-[10px] text-[#849a71] font-extrabold block">
              💡 هل تعلمين؟ 94% من العميلات يخترن "عرض قطعتين بـ 22 دينار" لتوفير 6 دنانير وإهداء قطعة للأخت أو الصديقة! 🎁
            </span>
          </div>
        </div>

        {/* 7.5. Interactive Video Player Section Showcase */}
        <div className="p-4 bg-[#111111]">
          <div className="bg-[#161616] rounded-2xl p-4 text-white shadow-lg border border-white/5">
            <div className="text-center mb-3">
              <span className="bg-[#849a71]/10 text-[#849a71] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#849a71]/20 inline-block">
                ✨ فيديو توضيحي للعرض الفعلي
              </span>
              <h3 className="text-sm font-extrabold text-white mt-1.5">شاهدي العباية على الطبيعة قبل الطلب</h3>
              <p className="text-[10px] text-neutral-400 mt-0.5">تفاصيل دقيقة تسحر القلوب تظهر حركة القماش وانسيابيته الملكية</p>
            </div>

            {/* Premium Video Player */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 shadow-inner bg-black flex flex-col justify-center items-center">
              <video 
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls
                poster="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800"
              >
                {/* User's uploaded Abaya video */}
                <source src="/abaya-video.mp4" type="video/mp4" />
                <source src="https://assets.mixkit.co/videos/preview/mixkit-elegant-woman-wearing-a-traditional-black-robe-with-gold-elements-43340-large.mp4" type="video/mp4" />
                متصفحك لا يدعم تشغيل الفيديو.
              </video>
              
              {/* Fallback & Custom overlay description */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[9px] text-[#849a71] flex items-center justify-between border border-white/5">
                <span>📹 خامة كريب تركي أصلي 100%</span>
                <span>تطريز يدوي ستراس لامع ✨</span>
              </div>
            </div>

            <div className="mt-2 text-center">
              <span className="text-[10px] text-neutral-400">
                💡 الفيديو يعمل تلقائياً، يمكنكِ تشغيل الصوت أو إيقافه من أدوات التحكم.
              </span>
            </div>
          </div>
        </div>

        {/* 7.8. Programmatic Sizing Guide Section */}
        <div className="p-4 bg-[#111111]">
          <div className="bg-[#161616] rounded-2xl p-5 border border-white/5 shadow-xl text-white">
            <div className="text-center mb-4">
              <span className="bg-[#875667]/15 text-[#875667] text-[10px] font-bold px-3 py-1 rounded-full border border-[#875667]/20 inline-block">
                📐 دليل القياس الذكي لقصّة ملكيّة مريحة
              </span>
              <h3 className="text-sm font-extrabold text-white mt-2">اعرفي ملاءمتكِ المثالية بلمسة واحدة</h3>
              <p className="text-[10px] text-neutral-400 mt-1">
                تأكيدًا على جودة وملاءمة عباياتنا، قمنا ببرمجة هذا الدليل الذكي لمساعدتكِ في اختيار القياس المناسب بناءً على طولكِ ووزنكِ وتفادي أخطاء التفصيل.
              </p>
            </div>

            {/* Interactive Calculator Block */}
            <div className="bg-neutral-900/60 rounded-xl p-4 border border-white/5 space-y-4">
              {/* Dynamic suggestion panel */}
              <div className="bg-[#875667]/10 border border-[#875667]/30 rounded-xl p-3 text-center">
                <span className="text-[10px] text-neutral-400 block font-medium">ملاءمة العباية المقترحة بناءً على طولكِ ووزنكِ:</span>
                <span className="text-sm font-black text-[#849a71] block mt-1">
                  طول منسدل أنيق ومناسب تماماً لقامة {height} سم
                </span>
                <span className="text-[11px] text-neutral-300 block mt-1 leading-relaxed">
                  {weight <= 65 ? (
                    <span>تناسب وزنكِ الحالي ({weight} كغم) بقصة قياسية مريحة وأنيقة (Regular Fit) ✨</span>
                  ) : weight <= 85 ? (
                    <span>تناسب وزنكِ الحالي ({weight} كغم) بقصة فضفاضة وانسيابية مريحة (Comfort Fit) 🌸</span>
                  ) : (
                    <span>قصّة ملكية مريحة جداً مصممة خصيصاً لاستيعاب وزنكِ الحالي لغاية 100 كيلو جرام لضمان الاحتشام الكامل والراحة (Extra Wide Royal Fit) 👑</span>
                  )}
                </span>
              </div>

              {/* Sliders to change height and weight */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center text-xs text-neutral-300 mb-1">
                    <span>الطول الحالي: <strong className="text-white font-mono">{height} سم</strong></span>
                    <span className="text-[10px] text-[#849a71] font-bold">طول العباية الفعلي المقترح: {getRecommendedSize(height)} سم</span>
                  </div>
                  <input 
                    type="range" 
                    min="130" 
                    max="195" 
                    value={height}
                    onChange={(e) => {
                      const h = Number(e.target.value);
                      setHeight(h);
                      setSelectedLength(getRecommendedSize(h));
                    }}
                    className="w-full accent-[#875667] bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs text-neutral-300 mb-1">
                    <span>الوزن الحالي: <strong className="text-white font-mono">{weight} كغم</strong></span>
                    <span className="text-[10px] text-emerald-400 font-bold">تستوعب لغاية 100 كغم 👍</span>
                  </div>
                  <input 
                    type="range" 
                    min="40" 
                    max="110" 
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full accent-[#875667] bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 text-center text-[10px] text-amber-400/80 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
              📌 <strong>ملاحظة هامة جداً:</strong> عباياتنا مصممة خصيصاً لتمنحكِ الراحة التامة وحرية الحركة اليومية بفضل نسيج الكريب الملكي المنسدل بلطف، وهو آمن ومناسب لجميع الأجسام والأوزان لغاية 100 كيلو غرام بدون قلق. يتم تحديد الطول والعرض ليكون ساتراً وجميلاً لامتصاص أي تفاوت في قياسات الجسم.
            </div>
          </div>
        </div>

        {/* 8. Super Secure Arabic Order Form */}
        <div ref={formRef} className="bg-[#fdfafb] text-[#111111] rounded-t-[30px] p-6 mt-6 shadow-2xl relative border-t-4 border-[#875667]" id="order-form-container">
          <div className="text-center mb-5">
            <span className="bg-[#875667]/15 text-[#875667] text-xs font-bold px-3 py-1 rounded-full border border-[#875667]/20 inline-block mb-2">
              🛒 الدفع نقداً عند استلام الطرد وتجربته
            </span>
            <h2 className="text-xl font-bold text-[#875667]">تأكيد الطلب السريع</h2>
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
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pr-10 pl-3 text-sm text-neutral-900 focus:outline-none focus:border-[#875667] focus:ring-1 focus:ring-[#875667] transition-all"
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
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pr-10 pl-3 text-sm text-neutral-900 font-mono focus:outline-none focus:border-[#875667] focus:ring-1 focus:ring-[#875667] transition-all"
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
                        ? 'bg-[#875667]/10 border-[#875667] text-neutral-900 shadow-sm' 
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
                        className="accent-[#875667] w-4 h-4 cursor-pointer"
                      />
                      <div className="text-right">
                        <span className="text-xs font-bold block text-neutral-800">{off.title.split(' (')[0]}</span>
                        {off.savings && <span className="text-[10px] text-emerald-600 font-bold">{off.savings}</span>}
                      </div>
                    </div>
                    <div className="text-left shrink-0">
                      <span className="text-sm font-extrabold text-[#875667]">{off.price} دينار</span>
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
                        ? 'bg-[#875667]/10 border-[#875667] text-[#875667] font-bold' 
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
                  <span>الوزن (كغم) *</span>
                </label>
                <div className="flex items-center gap-1.5 mt-1">
                  <button 
                    type="button"
                    onClick={() => setWeight(prev => Math.max(30, prev - 2))}
                    className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center font-bold text-sm text-neutral-700 cursor-pointer"
                  >
                    -
                  </button>
                  <input 
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Math.min(100, Math.max(30, Number(e.target.value))))}
                    className="w-12 bg-neutral-50 border border-gray-200 text-center py-1 rounded-lg text-xs font-bold font-mono focus:outline-none"
                    min="30"
                    max="100"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setWeight(prev => Math.min(100, prev + 2))}
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
                  <span>الطول (سم) *</span>
                </label>
                <div className="flex items-center gap-1.5 mt-1">
                  <button 
                    type="button"
                    onClick={() => {
                      const newH = Math.max(120, height - 2);
                      setHeight(newH);
                      setSelectedLength(getRecommendedSize(newH));
                    }}
                    className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center font-bold text-sm text-neutral-700 cursor-pointer"
                  >
                    -
                  </button>
                  <input 
                    type="number"
                    value={height}
                    onChange={(e) => {
                      const newH = Math.min(200, Math.max(120, Number(e.target.value)));
                      setHeight(newH);
                      setSelectedLength(getRecommendedSize(newH));
                    }}
                    className="w-12 bg-neutral-50 border border-gray-200 text-center py-1 rounded-lg text-xs font-bold font-mono focus:outline-none"
                    min="120"
                    max="200"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const newH = Math.min(200, height + 2);
                      setHeight(newH);
                      setSelectedLength(getRecommendedSize(newH));
                    }}
                    className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center font-bold text-sm text-neutral-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* City Dropdown & Detailed Address */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">المدينة / المحافظة *</label>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-3 pr-10 pl-3 text-sm text-neutral-900 focus:outline-none focus:border-[#875667] focus:ring-1 focus:ring-[#875667] transition-all cursor-pointer appearance-none"
                    required
                    id="input-customer-city"
                  >
                    {JORDAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <MapPin className="absolute top-3.5 right-3 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <div className="absolute inset-y-0 left-4 flex items-center pl-2 pointer-events-none text-neutral-500 font-mono text-[9px]">
                    ▼
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">العنوان بالتفصيل (الحي، الشارع، معلم بارز) *</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-3 pr-10 pl-3 text-sm text-neutral-900 focus:outline-none focus:border-[#875667] focus:ring-1 focus:ring-[#875667] transition-all"
                    placeholder="مثال: مرج الحمام - قرب دوار الدلة - عمارة رقم 5"
                    required
                    id="input-customer-address"
                  />
                  <MapPin className="absolute top-3.5 right-3 w-4 h-4 text-neutral-400" />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">يرجى كتابة اسم الحي، اسم الشارع، وأي معلم بارز قريب لتسهيل وسرعة الشحن.</p>
              </div>
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base md:text-lg py-4 px-6 rounded-xl cursor-pointer shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
              id="btn-order-submit"
            >
              <ShoppingBag className="w-5 h-5 shrink-0" />
              <span>اطلبي الآن 🛒</span>
            </button>

            {/* Professional Trust Badges */}
            <div className="grid grid-cols-3 gap-2.5 pt-6 border-t border-gray-200 mt-6 text-center">
              <div className="flex flex-col items-center p-2.5 bg-neutral-50 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-xl">🔎</span>
                <span className="text-[10px] font-extrabold text-neutral-800 mt-1">افحصي قبل الدفع</span>
                <span className="text-[8px] text-neutral-400 mt-0.5">ضمان المعاينة الكاملة</span>
              </div>
              <div className="flex flex-col items-center p-2.5 bg-neutral-50 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-xl">🚚</span>
                <span className="text-[10px] font-extrabold text-neutral-800 mt-1">توصيل مجاني</span>
                <span className="text-[8px] text-neutral-400 mt-0.5">لكافة محافظات الأردن</span>
              </div>
              <div className="flex flex-col items-center p-2.5 bg-neutral-50 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-xl">🔄</span>
                <span className="text-[10px] font-extrabold text-neutral-800 mt-1">سهولة الاستبدال</span>
                <span className="text-[8px] text-neutral-400 mt-0.5">خلال 3 أيام عمل</span>
              </div>
            </div>
            <div className="text-center text-[9px] text-[#875667] font-bold tracking-wider mt-4">
              ⚡ الكمية محدودة جداً - احصلي على العرض الأقوى اليوم ⚡
            </div>

          </form>
        </div>

        {/* 9. Footer Terms */}
        <footer className="bg-[#111111] text-neutral-400 py-6 text-center px-4 text-[10px] border-t border-white/5">
          <p>© {new Date().getFullYear()} حكاية خيط للعبايات الفاخرة. جميع الحقوق محفوظة.</p>
          <p className="mt-1 text-neutral-500">هذه الصفحة مشفرة وآمنة لتلقي طلبات المبيعات بكفاءة وسرعة فائقة.</p>
        </footer>

      </div>

      {/* 10. Sticky / Floating Buy Button (Visible on mobile screens as they scroll) */}
      <div className="fixed bottom-0 inset-x-0 p-3 bg-neutral-900/90 backdrop-blur-md border-t border-white/5 z-30 flex justify-center sm:hidden">
        <a 
          href="#order-form-container" 
          onClick={scrollToForm}
          className="w-full max-w-[450px] bg-emerald-600 hover:bg-emerald-700 text-white text-center font-extrabold py-3.5 px-4 rounded-xl text-xs tracking-wider uppercase shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all duration-300"
        >
          <ShoppingBag className="w-4.5 h-4.5 shrink-0" />
          <span>اطلبي الآن 🛒</span>
        </a>
      </div>

    </div>
  );
}
