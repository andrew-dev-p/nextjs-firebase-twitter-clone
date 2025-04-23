import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/auth";
import { useAuthStore } from "@/stores/auth-store";
import { getUserFromDb } from "@/firebase/db";

export function useFirebaseAuth() {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const user = await getUserFromDb(firebaseUser.uid);

          setUser({
            username: user?.username || "",
            email: user?.email || "",
            profilePhotoUrl: user?.profilePhotoUrl || "",
            id: firebaseUser.uid,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading, setError]);
}
