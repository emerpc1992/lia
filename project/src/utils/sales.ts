import { Sale } from '../types/sales';

export function generateSaleId(): string {
  const prefix = 'VTA';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function migrateSaleData(sale: Partial<Sale>): Sale {
  // Ensure all required fields are present with defaults
  return {
    ...sale,
    payment: sale.payment || { method: 'cash' },
    notes: sale.notes || '',
    staff: sale.staff,
    id: sale.id || generateSaleId(),
    date: sale.date || new Date().toISOString(),
    total: sale.total || 0,
    products: sale.products || [],
    client: sale.client!
  } as Sale;
}