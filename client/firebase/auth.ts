import {
  getAuth,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
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

export async function updateUserEmail(newEmail: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is currently signed in.");
  await updateEmail(user, newEmail);
}

export async function changeUserPassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No user is currently signed in.");
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

export { sendEmailVerification, createUserWithEmailAndPassword, signOut };
