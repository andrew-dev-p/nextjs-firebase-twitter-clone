import { create } from "zustand";
import type { UserEntity } from "@/types/entities";

type UserState = Pick<
  UserEntity,
  "username" | "email" | "profilePhotoUrl"
> | null;

interface AuthState {
  user: UserState;
  setUser: (user: UserState) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user: UserState) => set({ user }),
}));
