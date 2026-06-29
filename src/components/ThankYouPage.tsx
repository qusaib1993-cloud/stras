/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Order } from '../types';
import { 
  CheckCircle, 
  PhoneCall, 
  MapPin, 
  ShoppingBag, 
  MessageSquare, 
  Sparkles, 
  ChevronLeft
} from 'lucide-react';

interface ThankYouPageProps {
  order: Order | null;
  onGoBack: () => void;
}

export default function ThankYouPage({ order, onGoBack }: ThankYouPageProps) {
  const [pixelStatus, setPixelStatus] = useState<'firing' | 'fired'>('firing');

  useEffect(() => {
    // 1. Simulate Meta Pixel firing
    console.log('--- META PIXEL SIMULATION ---');
    console.log('fbq("track", "Purchase", {');
    console.log(`  value: ${order?.totalPrice || 22},`);
    console.log('  currency: "JOD",');
    console.log(`  content_name: "${order?.offer || 'Abaya'}",`);
    console.log(`  content_category: "Abayas",`);
    console.log(`  content_ids: ["${order?.id || 'N/A'}"],`);
    console.log('});');
    console.log('-----------------------------');

    const timer = setTimeout(() => {
      setPixelStatus('fired');
    }, 1500);

    return () => clearTimeout(timer);
  }, [order]);

  if (!order) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
        <div className="w-full max-w-[500px] bg-[#111111] rounded-2xl p-6 text-center border border-white/5 shadow-xl">
          <p className="text-neutral-400 font-medium">عذراً، لم يتم العثور على بيانات الطلب الحالية.</p>
          <button 
            onClick={onGoBack}
            className="mt-4 bg-[#875667] text-white px-5 py-2 rounded-xl text-sm font-bold cursor-pointer"
          >
            العودة لصفحة الهبوط
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#1a1a1a] text-neutral-100 font-sans pb-12 pt-6">
      <div className="w-full max-w-[500px] mx-auto bg-[#111111] min-h-screen shadow-2xl relative border-x border-white/5 rounded-2xl overflow-hidden">
        
        {/* Top Header Logo */}
        <div className="bg-[#111111] py-5 px-4 text-center border-b border-white/5">
          <h2 className="text-xs uppercase tracking-widest text-[#849a71] font-semibold">حكاية خيط للعبايات الفاخرة</h2>
        </div>

        {/* Dynamic Meta Pixel Success Notification HUD */}
        <div className="bg-emerald-950/20 border-b border-emerald-500/10 px-4 py-2.5 flex items-center justify-between text-xs text-emerald-400">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${pixelStatus === 'firing' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${pixelStatus === 'firing' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span>كود تتبع ميتا (Meta Pixel):</span>
          </div>
          <span className="font-mono bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-bold">
            {pixelStatus === 'firing' ? '⏳ جاري التسجيل (Purchase)...' : '✓ تم تسجيل مبيعة ناجحة!'}
          </span>
        </div>

        <div className="p-6">
          {/* Success Card Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full mx-auto flex items-center justify-center text-emerald-400 shadow-md mb-3.5">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-lg font-bold text-white">أهلاً بكِ.. تم استلام طلبكِ بنجاح!</h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-[90%] mx-auto leading-relaxed">
              شكراً جزيلاً لثقتكِ بنا. تم إدخال طلب العباية الفاخرة مباشرة إلى قسم التجهيز والشحن السريع لتسليمه لكِ في أسرع وقت.
            </p>
          </div>

          {/* Receipt / Order details */}
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-5 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <h3 className="font-bold text-xs uppercase tracking-widest text-[#875667] flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" />
                <span>تفاصيل فاتورة طلبكِ:</span>
              </h3>
              <span className="font-mono text-[10px] font-bold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded border border-white/5">
                رقم الطلب: {order.id}
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Name */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">اسم المستلم:</span>
                <span className="font-bold text-white">{order.name}</span>
              </div>

              {/* Phone */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">رقم الهاتف:</span>
                <span className="font-mono font-bold text-white">{order.phone}</span>
              </div>

              {/* Offer */}
              <div className="flex justify-between items-start text-xs">
                <span className="text-neutral-400 shrink-0">العرض المختار:</span>
                <span className="font-bold text-white text-left max-w-[70%]">{order.offer}</span>
              </div>

              {/* Color */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">اللون المطلوب:</span>
                <span className="font-bold text-white">{order.color}</span>
              </div>

              {/* Standard Size parameters */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">المقاس المعياري:</span>
                <span className="font-bold text-white">
                  الوزن: {order.weight} كغم / الطول: {order.height} سم
                </span>
              </div>

              {/* Shipping Address */}
              <div className="flex justify-between items-start text-xs pt-1 border-t border-white/5">
                <span className="text-neutral-400 shrink-0 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>عنوان التوصيل:</span>
                </span>
                <span className="font-bold text-white text-left max-w-[70%] leading-relaxed">{order.address}</span>
              </div>

              {/* Payment Method */}
              <div className="flex justify-between items-center text-xs pt-1 border-t border-white/5">
                <span className="text-neutral-400">طريقة الدفع:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <span>الدفع نقداً عند الاستلام (COD)</span>
                  <span className="text-xs">💵</span>
                </span>
              </div>

              {/* Price / Shipping cost */}
              <div className="flex justify-between items-center text-xs pt-1 border-t border-white/5">
                <span className="text-neutral-400">تكلفة التوصيل:</span>
                <span className="font-bold text-emerald-400">مجاني بالكامل (0 د.أ)</span>
              </div>

              <div className="flex justify-between items-center text-sm pt-2">
                <span className="font-bold text-white">المجموع المطلوب للدفع:</span>
                <span className="font-extrabold text-base text-[#849a71] font-mono">{order.totalPrice} دينار أردني</span>
              </div>

            </div>
          </div>

          {/* Cash on Delivery Guarantee Info Card */}
          <div className="mt-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 text-xs text-emerald-400 leading-relaxed">
            <h4 className="font-bold flex items-center gap-1.5 mb-1.5 text-emerald-300">
              <span>💵</span>
              <span>تذكير بآلية الدفع عند الاستلام (COD):</span>
            </h4>
            <p className="text-neutral-300">
              يرجى تجهيز مبلغ <strong>{order.totalPrice} دينار أردني</strong> نقداً قبل وصول المندوب. نود تذكيركِ مجدداً بأنكِ <strong className="text-white underline">تمتلكين كامل الحق بفتح الطرد، فحص جودة خامة الكريب والتطريز بالكامل، وتجربة المقاس</strong> قبل دفع أي قرش للمندوب. رضاكِ هو أولويتنا القصوى!
            </p>
          </div>

          {/* Next Steps Warning */}
          <div className="mt-5 bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 text-xs text-amber-400 leading-relaxed">
            <h4 className="font-bold flex items-center gap-1.5 mb-1.5 text-[#849a71]">
              <PhoneCall className="w-4 h-4 shrink-0 animate-bounce text-[#849a71]" />
              <span>📢 الخطوة القادمة الهامة جداً:</span>
            </h4>
            سيقوم فريق خدمة العملاء لدينا بالتواصل معكِ هاتفياً خلال الـ 24 ساعة القادمة (من الرقم الخاص بنا) لتأكيد موعد الشحن والتسليم لباب بيتكِ. <strong className="underline text-amber-300">يرجى إبقاء هاتفكِ متاحاً للرد لتجنب إلغاء الطلب تلقائياً.</strong>
          </div>

          {/* Quick Support Actions */}
          <div className="mt-6 space-y-2.5">
            {/* Live support via WhatsApp */}
            <a 
              href={`https://wa.me/962775347250?text=${encodeURIComponent(`أهلاً حكاية خيط، قمت بطلب عباية الستراس ورقم طلبي هو ${order.id} باسم ${order.name}. أريد تعديل أو متابعة الطلب.`)}`}
              target="_blank"
              rel="noreferrer noopener"
              className="w-full bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              id="btn-whatsapp-support"
            >
              <MessageSquare className="w-4.5 h-4.5 shrink-0" />
              <span>تواصل سريع واتساب لتعديل الطلب 💬</span>
            </a>

            {/* Back to Home Page button */}
            <button
              onClick={onGoBack}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/5"
              id="btn-back-to-landing"
            >
              <ChevronLeft className="w-4 h-4 shrink-0 rotate-180" />
              <span>العودة لصفحة العرض الرئيسية</span>
            </button>
          </div>

        </div>

        {/* Footer info */}
        <footer className="bg-[#111111] text-neutral-500 py-4 text-center px-4 text-[10px] border-t border-white/5 mt-12">
          <p>© {new Date().getFullYear()} حكاية خيط للعبايات الفاخرة. جميع الحقوق محفوظة.</p>
        </footer>

      </div>
    </div>
  );
}
