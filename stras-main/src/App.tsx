/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Order } from './types';
import { INITIAL_ORDERS } from './data';
import LandingPage from './components/LandingPage';
import ThankYouPage from './components/ThankYouPage';
import Dashboard from './components/Dashboard';

export default function App() {
  const [view, setView] = useState<'landing' | 'thankyou' | 'dashboard'>('landing');
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Load orders from localStorage on mount, else populate with realistic seeds
  useEffect(() => {
    const saved = localStorage.getItem('dar_al_malika_orders');
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (err) {
        setOrders(INITIAL_ORDERS);
      }
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('dar_al_malika_orders', JSON.stringify(INITIAL_ORDERS));
    }
  }, []);

  // Sync state changes with localStorage
  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('dar_al_malika_orders', JSON.stringify(updatedOrders));
  };

  // 1. Submit Order from Landing Page
  const handleOrderSubmit = (orderData: {
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

    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    setCurrentOrder(newOrder);
    
    // Smooth transition to Thank You page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView('thankyou');
  };

  // 2. Update order status from Admin Dashboard
  const handleUpdateOrderStatus = (orderId: string, status: Order['status'], notes?: string) => {
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          notes: notes || o.notes
        };
      }
      return o;
    });
    saveOrders(updatedOrders);
  };

  // 3. Add manual phone order from Admin Dashboard
  const handleAddManualOrder = (manualData: Omit<Order, 'id' | 'date'>) => {
    const randomIdNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `ORD-${randomIdNum}`;

    const newOrder: Order = {
      ...manualData,
      id: newId,
      date: new Date().toISOString()
    };

    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
  };

  return (
    <main className="min-h-screen bg-[#111111] selection:bg-[#9d6b7c] selection:text-white">
      {view === 'landing' && (
        <LandingPage 
          onOrderSubmit={handleOrderSubmit} 
          onGoToDashboard={() => setView('dashboard')}
        />
      )}

      {view === 'thankyou' && (
        <ThankYouPage 
          order={currentOrder} 
          onGoBack={() => setView('landing')}
        />
      )}

      {view === 'dashboard' && (
        <Dashboard 
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onAddManualOrder={handleAddManualOrder}
          onGoBackToStore={() => setView('landing')}
        />
      )}
    </main>
  );
}
