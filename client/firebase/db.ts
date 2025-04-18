import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "./config";
import { UserEntity } from "@/types/entities";

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
