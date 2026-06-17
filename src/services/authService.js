import { signInWithPopup, signInWithRedirect, signOut, getRedirectResult } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    return { user: result.user, token };
  } catch (error) {
    if (error.code === "auth/popup-blocked") {
      await signInWithRedirect(auth, googleProvider);
    }
    throw error;
  }
};

export const getGoogleRedirectResult = async () => {
  const result = await getRedirectResult(auth);
  if (result) {
    const token = await result.user.getIdToken();
    return { user: result.user, token };
  }
  return null;
};

export const logout = async () => {
  await signOut(auth);
  localStorage.removeItem("token");
};