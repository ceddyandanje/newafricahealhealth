
'use client';

import { create } from 'zustand';

interface SidebarState {
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  isExpanded: false,
  setIsExpanded: (isExpanded) => set({ isExpanded }),
}));
