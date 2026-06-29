/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Order {
  id: string;
  name: string;
  phone: string;
  offer: string;
  color: string;
  weight: number;
  height: number;
  address: string;
  date: string; // ISO date string
  status: 'pending' | 'confirmed' | 'shipped' | 'cancelled';
  notes?: string;
  totalPrice: number;
}

export interface Offer {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  isPopular?: boolean;
  badge?: string;
  savings?: string;
}

export interface ColorOption {
  id: string;
  name: string;
  code: string;
  hex: string;
  secondaryHex?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  avatarColor: string;
}
