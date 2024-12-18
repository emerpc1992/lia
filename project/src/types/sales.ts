import { Client } from './clients';
import { Product } from './products';
import { Staff } from './staff';

export type PaymentMethod = 'cash' | 'card' | 'transfer';

export interface Sale {
  id: string;
  date: string;
  client: Client;
  products: SaleProduct[];
  total: number;
  notes?: string;
  staff?: {
    member: Staff;
    commission: number;
  };
  payment: {
    method: PaymentMethod;
    reference?: string;
  };
}

export interface SaleProduct extends Omit<Product, 'quantity'> {
  quantity: number;
  subtotal: number;
  originalPrice?: number;
  discount?: number;
}