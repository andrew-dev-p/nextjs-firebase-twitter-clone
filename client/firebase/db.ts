import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "./config";

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
