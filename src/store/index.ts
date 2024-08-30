import { create } from "zustand";

interface State {
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
}

export const useStore = create<State>()((set) => ({
  menuOpen: false,
  setMenuOpen: (value) => set(() => ({ menuOpen: value })),
}));
