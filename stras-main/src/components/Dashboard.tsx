/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Order } from '../types';
import { COLORS } from '../data';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Truck, 
  Search, 
  Plus, 
  Download, 
  Filter, 
  ArrowRight,
  FileText,
  Percent,
  PlusCircle,
  AlertCircle
} from 'lucide-react';

interface DashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], notes?: string) => void;
  onAddManualOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  onGoBackToStore: () => void;
}

export default function Dashboard({ orders, onUpdateOrderStatus, onAddManualOrder, onGoBackToStore }: DashboardProps) {
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Manual order form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualOffer, setManualOffer] = useState('قطعتين بـ 22 دينار (العرض الأوفر والأكثر طلباً) 🔥');
  const [manualColor, setManualColor] = useState(COLORS[0].name);
  const [manualWeight, setManualWeight] = useState(70);
  const [manualHeight, setManualHeight] = useState(160);
  const [manualAddress, setManualAddress] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [manualStatus, setManualStatus] = useState<Order['status']>('confirmed');
  const [manualError, setManualError] = useState('');

  // Dashboard Stats Calculations
  const totalOrdersCount = orders.length;
  const activeOrders = orders.filter(o => o.status !== 'cancelled');
  
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const averageOrderValue = totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount).toFixed(2) : '0';
  
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const confirmedOrdersCount = orders.filter(o => o.status === 'confirmed').length;
  const shippedOrdersCount = orders.filter(o => o.status === 'shipped').length;
  const cancelledOrdersCount = orders.filter(o => o.status === 'cancelled').length;

  // Calculate simulated traffic and conversion rate
  const simulatedVisits = Math.max(100, totalOrdersCount * 14 + 45);
  const conversionRate = simulatedVisits > 0 ? ((totalOrdersCount / simulatedVisits) * 100).toFixed(1) : '0';

  // Filtered orders list
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handler to submit manual order
  const handleAddManualOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');

    if (!manualName.trim() || !manualPhone.trim() || !manualAddress.trim()) {
      setManualError('يرجى ملء جميع الحقول الإلزامية التي تحتوي على علامة *');
      return;
    }

    if (!manualPhone.startsWith('07') || manualPhone.length < 10) {
      setManualError('يرجى إدخال رقم هاتف أردني صحيح يتكون من 10 أرقام (مثال: 0790000000)');
      return;
    }

    const price = manualOffer.includes('22') ? 22 : 14;

    onAddManualOrder({
      name: manualName,
      phone: manualPhone,
      offer: manualOffer,
      color: manualColor,
      weight: manualWeight,
      height: manualHeight,
      address: manualAddress,
      status: manualStatus,
      notes: manualNotes,
      totalPrice: price
    });

    // Reset Form
    setManualName('');
    setManualPhone('');
    setManualAddress('');
    setManualNotes('');
    setShowAddModal(false);
  };

  // Quick export simulation
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `abaya_orders_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#111111] text-neutral-100 font-sans pb-12">
      
      {/* Top Header */}
      <div className="bg-[#161616] border-b border-white/5 sticky top-0 z-30 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#9d6b7c] to-[#111111] border border-[#d4af37]/20 rounded-xl flex items-center justify-center text-[#d4af37] font-extrabold shadow-lg">
            ♛
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white">لوحة تحكم المبيعات - دار الملكة</h1>
            <p className="text-[11px] text-neutral-400">نظام إدارة مبيعات وتتبع أداء حملة Meta Ads الحالية</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onGoBackToStore}
            className="bg-[#1a1a1a] hover:bg-neutral-800 text-[#d4af37] text-xs font-bold px-4 py-2.5 rounded-xl border border-white/5 flex items-center gap-1.5 transition-all cursor-pointer"
            id="btn-return-store"
          >
            <ArrowRight className="w-4 h-4" />
            <span>عرض المتجر الرئيسي</span>
          </button>

          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#d4af37] hover:bg-[#c9a330] text-black text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            id="btn-add-manual"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إضافة طلب جديد 🛒</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Analytics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Revenue */}
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-neutral-400 font-bold block">إجمالي الإيرادات المؤكدة</span>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1">{totalRevenue} <span className="text-xs">د.أ</span></h3>
              <p className="text-[10px] text-neutral-500 mt-0.5">شامل التوصيل المجاني</p>
            </div>
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Total Orders */}
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-neutral-400 font-bold block">إجمالي طلبات الشراء</span>
              <h3 className="text-xl sm:text-2xl font-black text-[#d4af37] font-mono mt-1">{totalOrdersCount} <span className="text-xs">طلبات</span></h3>
              <p className="text-[10px] text-neutral-500 mt-0.5">معدل التحويل المتوقع: {conversionRate}%</p>
            </div>
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: AOV */}
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-neutral-400 font-bold block">متوسط قيمة الطلب (AOV)</span>
              <h3 className="text-xl sm:text-2xl font-black text-rose-400 font-mono mt-1">{averageOrderValue} <span className="text-xs">د.أ</span></h3>
              <p className="text-[10px] text-neutral-500 mt-0.5">مرتفع جداً بفضل الـ Upsell</p>
            </div>
            <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Meta Conversion Rate */}
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-neutral-400 font-bold block">معدل تحويل الزوار</span>
              <h3 className="text-xl sm:text-2xl font-black text-blue-400 font-mono mt-1">{conversionRate}%</h3>
              <p className="text-[10px] text-neutral-500 mt-0.5">زيارة المقدرة: {simulatedVisits} عميلة</p>
            </div>
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
              <Percent className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Dynamic Status Badges Counters Grid */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="bg-[#161616]/50 border border-white/5 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-neutral-400 block">قيد الانتظار</span>
            <span className="text-sm font-bold text-amber-500 font-mono">{pendingOrdersCount}</span>
          </div>
          <div className="bg-[#161616]/50 border border-white/5 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-neutral-400 block">تم التأكيد هاتفياً</span>
            <span className="text-sm font-bold text-green-500 font-mono">{confirmedOrdersCount}</span>
          </div>
          <div className="bg-[#161616]/50 border border-white/5 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-neutral-400 block">تم الشحن والتسليم</span>
            <span className="text-sm font-bold text-blue-500 font-mono">{shippedOrdersCount}</span>
          </div>
          <div className="bg-[#161616]/50 border border-white/5 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-neutral-400 block">ملغي / مرفوض</span>
            <span className="text-sm font-bold text-rose-500 font-mono">{cancelledOrdersCount}</span>
          </div>
        </div>

        {/* Interactive Fabric & Color Popularity Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          
          {/* Column 1 & 2: Order Manager Panel */}
          <div className="md:col-span-2 bg-[#161616] border border-white/5 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#9d6b7c]" />
                  <span>إدارة طلبات العميلات</span>
                </h3>
                <p className="text-[11px] text-neutral-400">ابحثي، فلتر، وعدلي حالات الطلبات هاتفياً لتجهيز الشحنات فوراً</p>
              </div>

              <button 
                onClick={handleExportData}
                className="bg-[#1a1a1a] hover:bg-neutral-800 text-[#d4af37] text-xs font-bold px-3 py-2 rounded-xl border border-white/5 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير الطلبات (JSON)</span>
              </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              {/* Search */}
              <div className="relative flex-1">
                <input 
                  type="text"
                  placeholder="ابحثي بالاسم، رقم الهاتف، أو العنوان..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#111111] border border-white/5 rounded-xl py-2.5 pr-10 pl-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                />
                <Search className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500" />
              </div>

              {/* Status Selector */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#111111] border border-white/5 rounded-xl py-2.5 pr-8 pl-4 text-xs text-neutral-200 focus:outline-none focus:border-[#d4af37] cursor-pointer"
                >
                  <option value="all">كل الحالات الحالية</option>
                  <option value="pending">قيد الانتظار (لم يؤكد بعد)</option>
                  <option value="confirmed">تم تأكيده هاتفياً</option>
                  <option value="shipped">تم الشحن والارسال</option>
                  <option value="cancelled">ملغي من العميلة</option>
                </select>
                <Filter className="absolute top-3.5 right-3 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Orders Table list */}
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#111111] text-neutral-400 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">رقم المعاملة</th>
                    <th className="py-3 px-4">العميلة والتلفون</th>
                    <th className="py-3 px-4">العرض المختار واللون</th>
                    <th className="py-3 px-4">المقاس والوزن</th>
                    <th className="py-3 px-4">موقع التوصيل</th>
                    <th className="py-3 px-4 text-center">الحالة</th>
                    <th className="py-3 px-4 text-center">تحديث هاتفياً</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#161616]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-neutral-500 font-bold">
                        لم يتم العثور على أي طلبات تطابق معايير البحث الحالية!
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-900/40 transition-colors">
                        {/* ID & Date */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-neutral-300 block">{order.id}</span>
                          <span className="text-[10px] text-neutral-500 block mt-0.5">
                            {new Date(order.date).toLocaleString('ar-JO', { hour12: true, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        {/* Customer Info */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="font-extrabold text-white block text-sm">{order.name}</span>
                          <span className="font-mono text-neutral-400 block mt-0.5 font-bold">{order.phone}</span>
                        </td>

                        {/* Offer & Color */}
                        <td className="py-4 px-4">
                          <span className="font-bold text-rose-300 block leading-normal">{order.offer.split(' (')[0]}</span>
                          <span className="text-[10px] text-amber-400 font-bold block mt-0.5">{order.color}</span>
                        </td>

                        {/* Physical attributes */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-neutral-300 block font-bold">الوزن: {order.weight} كغم</span>
                          <span className="text-neutral-400 block text-[10px] mt-0.5">الطول: {order.height} سم</span>
                        </td>

                        {/* Address */}
                        <td className="py-4 px-4 max-w-[180px]">
                          <span className="text-neutral-300 leading-relaxed block line-clamp-2" title={order.address}>
                            {order.address}
                          </span>
                        </td>

                        {/* Status badge */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          {order.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/20">
                              <Clock className="w-3 h-3 animate-pulse" />
                              <span>قيد الانتظار</span>
                            </span>
                          )}
                          {order.status === 'confirmed' && (
                            <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-500/20">
                              <CheckCircle className="w-3 h-3" />
                              <span>مؤكد هاتفياً</span>
                            </span>
                          )}
                          {order.status === 'shipped' && (
                            <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-500/20">
                              <Truck className="w-3 h-3" />
                              <span>تم الشحن</span>
                            </span>
                          )}
                          {order.status === 'cancelled' && (
                            <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-rose-500/20">
                              <XCircle className="w-3 h-3" />
                              <span>ملغي</span>
                            </span>
                          )}
                        </td>

                        {/* Actions to update */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            {order.status !== 'confirmed' && order.status !== 'shipped' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'confirmed', 'تم التأكيد بالاتصال الهاتفي')}
                                className="bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                                title="تأكيد الطلب هاتفياً"
                              >
                                تأكيد
                              </button>
                            )}
                            {order.status === 'confirmed' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'shipped', 'تم تسليمه لشركة التوصيل المحلية')}
                                className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                                title="شحن الطلب"
                              >
                                شحن
                              </button>
                            )}
                            {order.status !== 'cancelled' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'cancelled', 'ألغت العميلة الطلب هاتفياً')}
                                className="bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                                title="إلغاء الطلب"
                              >
                                إلغاء
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Column 3: Color Statistics & Info */}
          <div className="space-y-6">
            
            {/* Color Popularity Visual CSS Bar Chart */}
            <div className="bg-[#161616] border border-white/5 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-extrabold text-[#d4af37] mb-1.5 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#d4af37]" />
                <span>شعبية الألوان المطلوبة</span>
              </h3>
              <p className="text-[10px] text-neutral-400 mb-4">أي الألوان هي الأكثر جاذبية لزائرات حملة إعلانات ميتا؟</p>

              <div className="space-y-3">
                {COLORS.map((col) => {
                  const matchingCount = orders.filter(o => o.color.includes(col.name.split(' ')[0])).length;
                  const ratio = totalOrdersCount > 0 ? (matchingCount / totalOrdersCount) * 100 : 0;
                  
                  return (
                    <div key={col.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: col.hex }} />
                          <span className="text-white text-[11px]">{col.name.split(' ')[0]} ({col.code})</span>
                        </div>
                        <span className="text-neutral-400 font-mono text-[11px]">{matchingCount} طلب ({ratio.toFixed(0)}%)</span>
                      </div>
                      
                      {/* Bar */}
                      <div className="w-full bg-[#111111] rounded-full h-2 overflow-hidden border border-white/5">
                        <div 
                          className="h-full rounded-full transition-all duration-1000" 
                          style={{ 
                            width: `${Math.max(4, ratio)}%`, 
                            backgroundColor: col.hex,
                            boxShadow: `0 0 8px ${col.hex}`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Tips for Meta Ads Success */}
            <div className="bg-[#1a1415] border border-[#d4af37]/20 rounded-2xl p-4 text-xs">
              <h4 className="font-extrabold text-[#d4af37] mb-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>نصائح ذهبية لنجاح إعلانات ميتا 🚀</span>
              </h4>
              <ul className="space-y-2 text-neutral-300 leading-relaxed list-disc list-inside">
                <li><strong className="text-amber-300">سرعة التحميل فائقة:</strong> لقد صممنا صفحة الهبوط لتكون خفيفة جداً لتحقيق أقصى سرعة تحميل، مما يقلل من تكلفة النقرة (CPC) لزائرات فيسبوك.</li>
                <li><strong className="text-amber-300">ألوان جذابة للعين:</strong> ركزي في تصاميم الإعلانات على لوني <span className="underline">الأسود الملكي</span> و<span className="underline">الوردي العتيق</span> لأنهما يسجلان أعلى مبيعات.</li>
                <li><strong className="text-amber-300">التأكيد الفوري:</strong> اتصلي بالعميلات خلال أول ساعة من تسجيل الطلب. سرعة الاتصال ترفع نسبة التأكيد لأكثر من 85%!</li>
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* Manual Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir="rtl">
          <div className="bg-[#161616] border border-white/5 rounded-2xl w-full max-w-[500px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-[#111111] px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-[#d4af37] flex items-center gap-1.5">
                <PlusCircle className="w-5 h-5 text-[#d4af37]" />
                <span>إضافة طلب شراء يدوي جديد</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white text-lg font-bold cursor-pointer font-serif"
              >
                ×
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddManualOrderSubmit} className="p-6 space-y-4 text-white">
              
              {manualError && (
                <div className="bg-red-950/40 border border-red-500/30 text-red-200 text-xs p-3 rounded-xl font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{manualError}</span>
                </div>
              )}

              {/* Customer Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-300 font-bold mb-1">اسم العميلة *</label>
                  <input 
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="w-full bg-[#111111] border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    placeholder="مثال: أسماء رائد"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-300 font-bold mb-1">رقم الهاتف *</label>
                  <input 
                    type="tel"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full bg-[#111111] border border-white/5 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#d4af37]"
                    placeholder="079XXXXXXX"
                    required
                  />
                </div>
              </div>

              {/* Offer and Color Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-300 font-bold mb-1">العرض المطلق *</label>
                  <select
                    value={manualOffer}
                    onChange={(e) => setManualOffer(e.target.value)}
                    className="w-full bg-[#111111] border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    <option value="قطعتين بـ 22 دينار (العرض الأوفر والأكثر طلباً) 🔥">قطعتين بـ 22 دينار (العرض الأوفر) 🔥</option>
                    <option value="قطعة واحدة بـ 14 دينار">قطعة واحدة بـ 14 دينار</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-300 font-bold mb-1">اللون الأساسي *</label>
                  <select
                    value={manualColor}
                    onChange={(e) => setManualColor(e.target.value)}
                    className="w-full bg-[#111111] border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    {COLORS.map((col) => (
                      <option key={col.id} value={col.name}>{col.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Physical Attributes Size Guide */}
              <div className="grid grid-cols-2 gap-3 bg-[#111111]/40 p-3 rounded-xl border border-white/5">
                <div>
                  <label className="block text-[10px] text-neutral-400 font-bold mb-1">الوزن التقريبي (كغم)</label>
                  <input 
                    type="number"
                    value={manualWeight}
                    onChange={(e) => setManualWeight(Number(e.target.value))}
                    className="w-full bg-[#111111] border border-white/5 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none"
                    min="30"
                    max="110"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 font-bold mb-1">الطول التقريبي (سم)</label>
                  <input 
                    type="number"
                    value={manualHeight}
                    onChange={(e) => setManualHeight(Number(e.target.value))}
                    className="w-full bg-[#111111] border border-white/5 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none"
                    min="120"
                    max="200"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[11px] text-neutral-300 font-bold mb-1">العنوان والمحافظة بالتفصيل *</label>
                <input 
                  type="text"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="w-full bg-[#111111] border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  placeholder="مثال: إربد - شارع الثلاثين - قرب مسجد الروضة"
                  required
                />
              </div>

              {/* Status and Notes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-300 font-bold mb-1">الحالة البدئية</label>
                  <select
                    value={manualStatus}
                    onChange={(e) => setManualStatus(e.target.value as Order['status'])}
                    className="w-full bg-[#111111] border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    <option value="pending">قيد الانتظار (تحت الطلب)</option>
                    <option value="confirmed">مؤكد هاتفياً</option>
                    <option value="shipped">تم إرساله للشحن</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-300 font-bold mb-1">ملاحظات داخلية</label>
                  <input 
                    type="text"
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                    className="w-full bg-[#111111] border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    placeholder="ملاحظات شركة الشحن..."
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold py-3 rounded-xl cursor-pointer"
                >
                  إلغاء التغيير
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#d4af37] text-black text-xs font-extrabold py-3 rounded-xl shadow-lg cursor-pointer"
                >
                  حفظ الطلب وتأكيده 💾
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
