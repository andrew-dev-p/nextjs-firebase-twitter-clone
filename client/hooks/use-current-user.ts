import { useEffect, useState } from "react";
import { auth } from "@/firebase/auth";
import { getUserFromDb } from "@/firebase/db";
import type { UserEntity } from "@/types/entities";

export function useCurrentUser(): UserEntity | null {
  const [userInfo, setUserInfo] = useState<UserEntity | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const dbUser = await getUserFromDb(user.uid);
        setUserInfo(dbUser);
      } else {
        setUserInfo(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return userInfo;
}
