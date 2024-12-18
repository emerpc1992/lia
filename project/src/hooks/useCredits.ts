import { useState, useEffect } from 'react';
import { Credit, Payment } from '../types/credits';
import { loadCredits, saveCredits } from '../storage/credits';
import { USERS } from '../constants/users';
import { calculateRemainingAmount } from '../utils/payments';

export function useCredits() {
  const [credits, setCredits] = useState<Credit[]>(() => {
    const savedCredits = loadCredits() || [];
    return savedCredits.map(credit => ({
      ...credit,
      payments: credit.payments || []
    }));
  });

  useEffect(() => {
    saveCredits(credits);
  }, [credits]);

  const addCredit = (creditData: Omit<Credit, 'payments'>) => {
    const newCredit: Credit = {
      ...creditData,
      payments: []
    };
    setCredits(current => [...current, newCredit]);
  };

  const updateCredit = (code: string, creditData: Credit) => {
    setCredits(current =>
      current.map(credit =>
        credit.code === code ? creditData : credit
      )
    );
  };

  const deleteCredit = (code: string, adminPassword: string): boolean => {
    const adminUser = USERS.find(user => 
      user.role === 'admin' && user.password === adminPassword
    );

    if (!adminUser) {
      return false;
    }

    setCredits(current =>
      current.filter(credit => credit.code !== code)
    );
    return true;
  };

  const addPayment = (creditCode: string, payment: Payment) => {
    setCredits(current =>
      current.map(credit => {
        if (credit.code !== creditCode) return credit;

        const updatedPayments = [...credit.payments, payment];
        const remainingAmount = calculateRemainingAmount(credit.totalAmount, updatedPayments);
        
        return {
          ...credit,
          payments: updatedPayments,
          status: remainingAmount <= 0 ? 'completed' : 'pending'
        };
      })
    );
  };

  const cancelPayment = (creditCode: string, paymentId: string, reason: string) => {
    setCredits(current =>
      current.map(credit => {
        if (credit.code !== creditCode) return credit;

        const updatedPayments = credit.payments.map(payment =>
          payment.id === paymentId
            ? { ...payment, status: 'cancelled', cancellationReason: reason }
            : payment
        );

        const remainingAmount = calculateRemainingAmount(credit.totalAmount, updatedPayments);
        
        return {
          ...credit,
          payments: updatedPayments,
          status: remainingAmount <= 0 ? 'completed' : 'pending'
        };
      })
    );
  };

  const deletePayment = (creditCode: string, paymentId: string, adminPassword: string): boolean => {
    const adminUser = USERS.find(user => 
      user.role === 'admin' && user.password === adminPassword
    );

    if (!adminUser) {
      return false;
    }

    setCredits(current =>
      current.map(credit => {
        if (credit.code !== creditCode) return credit;

        const updatedPayments = credit.payments.filter(payment => payment.id !== paymentId);
        const remainingAmount = calculateRemainingAmount(credit.totalAmount, updatedPayments);

        return {
          ...credit,
          payments: updatedPayments,
          status: remainingAmount <= 0 ? 'completed' : 'pending'
        };
      })
    );

    return true;
  };

  return {
    credits,
    addCredit,
    updateCredit,
    deleteCredit,
    addPayment,
    cancelPayment,
    deletePayment,
  };
}