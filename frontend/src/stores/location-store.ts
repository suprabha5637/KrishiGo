import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationState {
  city: string;
  area: string;
  pincode: string;
  setLocation: (city: string, area: string, pincode: string) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      city: 'Bengaluru', // default
      area: 'HSR Layout',
      pincode: '560102',
      setLocation: (city, area, pincode) => set({ city, area, pincode }),
    }),
    {
      name: 'location-storage',
    }
  )
);
