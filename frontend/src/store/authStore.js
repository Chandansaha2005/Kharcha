import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setupComplete: false,
      login: (token, user) =>
        set({
          token,
          user,
          setupComplete: Boolean(user?.setupComplete),
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          setupComplete: false,
        }),
      updateUser: (user) =>
        set({
          user,
          setupComplete: Boolean(user?.setupComplete),
        }),
      setSetupComplete: (setupComplete) => set({ setupComplete }),
    }),
    {
      name: "kharcha-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        setupComplete: state.setupComplete,
      }),
    }
  )
);
