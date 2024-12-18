import { useState, useEffect } from 'react';
import { Sale } from '../types/sales';
import { loadSales, saveSales } from '../storage/sales';
import { migrateSaleData } from '../utils/sales';

export function useSales() {
  const [sales, setSales] = useState<Sale[]>(() => {
    const savedSales = loadSales() || [];
    // Migrate existing sales data to include payment information
    return savedSales.map(sale => migrateSaleData(sale));
  });

  useEffect(() => {
    saveSales(sales);
  }, [sales]);

  const addSale = (sale: Sale) => {
    setSales(current => [migrateSaleData(sale), ...current]);
  };

  const updateSale = (id: string, saleData: Sale) => {
    setSales(current =>
      current.map(sale =>
        sale.id === id ? migrateSaleData(saleData) : sale
      )
    );
  };

  const deleteSale = (id: string) => {
    setSales(current =>
      current.filter(sale => sale.id !== id)
    );
  };

  return {
    sales,
    addSale,
    updateSale,
    deleteSale,
  };
}