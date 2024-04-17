import { create } from "zustand";
import { shallow } from 'zustand/shallow';

export interface StoreState {
  desktop: boolean,
  showMobileMenu: boolean,
  setShowMobileMenu: (showMobileMenu: boolean) => void,
  setDesktop: (desktop: boolean) => void
}

const useStore = create<StoreState>((set) => ({
  desktop: false,
  showMobileMenu: false,
  setShowMobileMenu: (showMobileMenu: boolean) => {
    set((state) => ({ showMobileMenu }))
  },
  setDesktop: (desktop: boolean) => {
    set((state) => ({ desktop }))
  },
}));

export { shallow, useStore };
