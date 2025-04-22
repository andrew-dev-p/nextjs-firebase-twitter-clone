import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/auth";
import { useAuthStore } from "@/stores/auth-store";

export function useFirebaseAuth() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          username: firebaseUser.displayName!,
          email: firebaseUser.email!,
          profilePhotoUrl: firebaseUser.photoURL || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);
}
