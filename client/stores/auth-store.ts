import { create } from "zustand";
import type { UserEntity } from "@/types/entities";

export type UserState = Pick<
  UserEntity,
  "id" | "username" | "email" | "profilePhotoUrl"
> | null;

interface AuthState {
  user: UserState;
  setUser: (user: UserState) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user: UserState) => set({ user }),
  loading: true,
  setLoading: (loading: boolean) => set({ loading }),
  error: null,
  setError: (error: string | null) => set({ error }),
}));
