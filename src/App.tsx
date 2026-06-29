/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Order } from './types';
import LandingPage from './components/LandingPage';
import ThankYouPage from './components/ThankYouPage';
import Dashboard from './components/Dashboard';
import { 
  db, 
  auth, 
  OperationType, 
  handleFirestoreError, 
  signInWithGoogle, 
  logout 
} from './firebase';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  query, 
  collection, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ShieldCheck, AlertTriangle, ArrowLeft, LogOut, Loader2 } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'landing' | 'thankyou' | 'dashboard'>('landing');
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string>('');

  // 1. Listen to auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Enforce the specific admin email address
        const isAdminUser = currentUser.email === 'qusai.b1993@gmail.com';
        setIsAdmin(isAdminUser);
        if (!isAdminUser) {
          setAuthError('عذراً، هذا البريد الإلكتروني لا يملك صلاحيات لوحة التحكم.');
        } else {
          setAuthError('');
        }
      } else {
        setIsAdmin(false);
        setAuthError('');
      }
      setAuthLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Load and sync orders from Firestore based on roles
  useEffect(() => {
    if (!isAdmin) {
      // Guest view: only load their locally placed orders from localStorage so they can track them
      const saved = localStorage.getItem('hekaya_khait_orders');
      if (saved) {
        try {
          setOrders(JSON.parse(saved));
        } catch (err) {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
      return;
    }

    // Admin view: Subscribe to all orders real-time ordered by date descending
    const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
    const unsubscribeOrders = onSnapshot(q, (snapshot) => {
      const loadedOrders: Order[] = [];
      snapshot.forEach((docSnap) => {
        loadedOrders.push(docSnap.data() as Order);
      });
      setOrders(loadedOrders);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsubscribeOrders();
  }, [isAdmin]);

  // 3. Submit Order from Landing Page
  const handleOrderSubmit = async (orderData: {
    name: string;
    phone: string;
    offer: string;
    color: string;
    weight: number;
    height: number;
    address: string;
  }) => {
    const randomIdNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `ORD-${randomIdNum}`;
    
    // Determine price
    const price = orderData.offer.includes('22') ? 22 : 14;

    const newOrder: Order = {
      id: newId,
      name: orderData.name,
      phone: orderData.phone,
      offer: orderData.offer,
      color: orderData.color,
      weight: orderData.weight,
      height: orderData.height,
      address: orderData.address,
      date: new Date().toISOString(),
      status: 'pending',
      totalPrice: price,
      notes: 'تم التسجيل عبر صفحة الهبوط السريعة'
    };

    try {
      // Save directly to Firestore orders collection
      await setDoc(doc(db, 'orders', newId), newOrder);

      // Save to locally submitted list so user can track it in the current browser session
      const saved = localStorage.getItem('hekaya_khait_orders');
      let localOrders: Order[] = [];
      if (saved) {
        try {
          localOrders = JSON.parse(saved);
        } catch (e) {
          localOrders = [];
        }
      }
      const updatedLocal = [newOrder, ...localOrders];
      localStorage.setItem('hekaya_khait_orders', JSON.stringify(updatedLocal));

      // Update local state for UI transition
      setOrders(updatedLocal);
      setCurrentOrder(newOrder);
      
      // Smooth transition to Thank You page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setView('thankyou');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `orders/${newId}`);
    }
  };

  // 4. Update order status from Admin Dashboard
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status'], notes?: string) => {
    if (!isAdmin) return;
    
    const orderRef = doc(db, 'orders', orderId);
    try {
      await updateDoc(orderRef, {
        status,
        notes: notes || ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  // 5. Add manual phone order from Admin Dashboard
  const handleAddManualOrder = async (manualData: Omit<Order, 'id' | 'date'>) => {
    if (!isAdmin) return;

    const randomIdNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `ORD-${randomIdNum}`;

    const newOrder: Order = {
      ...manualData,
      id: newId,
      date: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'orders', newId), newOrder);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `orders/${newId}`);
    }
  };

  const handleAdminSignIn = async () => {
    setAuthError('');
    try {
      const loggedInUser = await signInWithGoogle();
      if (loggedInUser.email !== 'qusai.b1993@gmail.com') {
        setAuthError('عذراً، هذا الحساب ليس لديه صلاحيات المسؤول.');
        await logout();
      }
    } catch (err: any) {
      setAuthError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleAdminSignOut = async () => {
    try {
      await logout();
      setView('landing');
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  return (
    <main className="min-h-screen bg-[#111111] selection:bg-[#875667] selection:text-white">
      {view === 'landing' && (
        <LandingPage 
          onOrderSubmit={handleOrderSubmit} 
          onGoToDashboard={() => setView('dashboard')}
          orders={orders}
        />
      )}

      {view === 'thankyou' && (
        <ThankYouPage 
          order={currentOrder} 
          onGoBack={() => setView('landing')}
        />
      )}

      {view === 'dashboard' && (
        authLoading ? (
          <div className="flex flex-col items-center justify-center min-h-screen text-white bg-[#111111]">
            <Loader2 className="w-10 h-10 text-[#d4af37] animate-spin mb-4" />
            <p className="text-sm font-bold">جاري التحقق من الصلاحيات...</p>
          </div>
        ) : !isAdmin ? (
          /* Custom Premium Admin Login Portal */
          <div dir="rtl" className="flex items-center justify-center min-h-screen px-4 bg-[#111111]">
            <div className="bg-[#161616] border border-white/5 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-8 space-y-6">
              
              {/* Brand Header */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-[#9d6b7c] to-[#111111] border border-[#d4af37]/30 rounded-2xl flex items-center justify-center text-[#d4af37] text-2xl font-black shadow-lg mx-auto">
                  ♛
                </div>
                <h2 className="text-xl font-black text-white">بوابة تسجيل دخول المسؤول</h2>
                <p className="text-xs text-neutral-400">لوحة تحكم الطلبات - متجر حكاية خيط</p>
              </div>

              {authError && (
                <div className="bg-red-950/30 border border-red-500/20 text-red-300 text-xs p-4 rounded-2xl flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">تنبيه الوصول المرفوض</p>
                    <p className="opacity-90 leading-relaxed">{authError}</p>
                  </div>
                </div>
              )}

              {user && !isAdmin && (
                <div className="bg-neutral-900 border border-white/5 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div className="text-neutral-300">
                    <span className="block text-[10px] text-neutral-500">الحساب الحالي:</span>
                    <span className="font-bold font-mono">{user.email}</span>
                  </div>
                  <button 
                    onClick={handleAdminSignOut}
                    className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>خروج</span>
                  </button>
                </div>
              )}

              {/* Login Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleAdminSignIn}
                  className="w-full bg-[#d4af37] hover:bg-[#c9a330] text-black font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer text-sm"
                  id="btn-admin-login-google"
                >
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  <span>تسجيل الدخول باستخدام Google</span>
                </button>

                <button
                  onClick={() => setView('landing')}
                  className="w-full bg-[#1a1a1a] hover:bg-neutral-800 text-neutral-300 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-white/5 cursor-pointer text-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>العودة إلى المتجر الرئيسي</span>
                </button>
              </div>

            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Minimal persistent floating Admin bar to easily log out */}
            <div dir="rtl" className="bg-[#1a1a1a] border-b border-white/5 px-6 py-2 flex justify-between items-center text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>أهلاً بك يا مسؤول 👑 (<span className="font-mono text-[11px] font-bold text-neutral-400">{user?.email}</span>)</span>
              </div>
              <button 
                onClick={handleAdminSignOut}
                className="text-neutral-400 hover:text-rose-400 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                id="btn-admin-logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
            
            <Dashboard 
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onAddManualOrder={handleAddManualOrder}
              onGoBackToStore={() => setView('landing')}
            />
          </div>
        )
      )}
    </main>
  );
}
