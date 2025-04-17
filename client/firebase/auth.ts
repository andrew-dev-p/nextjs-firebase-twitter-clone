import { getAuth, sendEmailVerification, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);

export const resendVerificationEmail = async (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is currently signed in.");
  await sendEmailVerification(user);
};

export const checkEmailVerification = async (): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is currently signed in.");
  await user.reload();
  return user.emailVerified;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  return signInWithPopup(auth, googleProvider);
};

export { sendEmailVerification, createUserWithEmailAndPassword, signOut };
