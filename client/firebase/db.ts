import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { app } from "./config";
import { UserEntity } from "@/types/entities";
import { auth } from "./auth";

export const db = getFirestore(app);

export async function createUserInDb({
  uid,
  username,
  email,
  profilePhotoUrl,
}: {
  uid: string;
  username: string;
  email: string;
  profilePhotoUrl?: string;
}) {
  return await setDoc(doc(db, "users", uid), {
    username,
    email,
    profilePhotoUrl,
    createdAt: new Date().toISOString(),
  });
}

export async function getUserFromDb(uid: string): Promise<UserEntity | null> {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return userDoc.data() as UserEntity;
  }

  return null;
}

export async function updateUserInDb({
  uid,
  username,
  email,
  profilePhotoUrl,
}: {
  uid: string;
  username: string;
  email: string;
  profilePhotoUrl?: string;
}) {
  return await updateDoc(doc(db, "users", uid), {
    username,
    email,
    profilePhotoUrl,
  });
}

export const getCurrentUser = async () => {
  const user = auth.currentUser;
  if (user) {
    return await getUserFromDb(user.uid);
  }
  return null;
};

export const deleteAccount = async (uid?: string) => {
  if (!auth.currentUser || !uid) throw new Error("User is not authenticated");
  await deleteDoc(doc(db, "users", uid));
  await auth.currentUser.delete();
};
