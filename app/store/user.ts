import { create } from "zustand";

interface UserStore {
  user?: UserInfo | null;
  credits: number;
  setUser: (user: UserInfo | null) => void;
  clearUser: () => void;
  setCredits: (credits: number) => void;
}

export const useUser = create<UserStore>((set) => {
  return {
    user: void 0,
    credits: 0,
    setUser: (user) => set({ user: user ?? null }),
    clearUser: () => set({ user: null }),
    setCredits: (credits) => set({ credits }),
  };
});
