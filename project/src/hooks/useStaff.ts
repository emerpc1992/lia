import { useState, useEffect } from 'react';
import { Staff } from '../types/staff';
import { loadStaff, saveStaff } from '../storage/staff';

export function useStaff() {
  const [staff, setStaff] = useState<Staff[]>(() => {
    return loadStaff() || [];
  });

  useEffect(() => {
    saveStaff(staff);
  }, [staff]);

  const addStaff = (staffMember: Staff) => {
    setStaff(current => [...current, staffMember]);
  };

  const updateStaff = (code: string, staffData: Staff) => {
    setStaff(current =>
      current.map(member =>
        member.code === code ? staffData : member
      )
    );
  };

  const deleteStaff = (code: string) => {
    setStaff(current =>
      current.filter(member => member.code !== code)
    );
  };

  return {
    staff,
    addStaff,
    updateStaff,
    deleteStaff,
  };
}