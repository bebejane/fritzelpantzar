import { create } from "zustand";
import { shallow } from 'zustand/shallow';

export interface StoreState {
  desktop: boolean,
  showMobileMenu: boolean,
  showAbout: boolean,
  hoverAbout: boolean,
  setHoverAbout: (hoverAbout: boolean) => void,
  setShowAbout: (showAbout: boolean) => void,
  setShowMobileMenu: (showMobileMenu: boolean) => void,
  setDesktop: (desktop: boolean) => void
}

const useStore = create<StoreState>((set) => ({
  desktop: false,
  showMobileMenu: false,
  showAbout: false,
  hoverAbout: false,
  setHoverAbout: (hoverAbout: boolean) => {
    set((state) => ({ hoverAbout }))
  },
  setShowAbout: (showAbout: boolean) => {
    set((state) => ({ showAbout }))
  },
  setShowMobileMenu: (showMobileMenu: boolean) => {
    set((state) => ({ showMobileMenu }))
  },
  setDesktop: (desktop: boolean) => {
    set((state) => ({ desktop }))
  },
}));

export { shallow, useStore };
