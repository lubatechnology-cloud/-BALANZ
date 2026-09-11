import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../firebase';
import { User } from '../types';

function firebaseUserToUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    createdAt: new Date(firebaseUser.metadata.creationTime || ''),
    updatedAt: new Date(firebaseUser.metadata.lastSignInTime || ''),
  };
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return firebaseUserToUser(result.user);
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  return firebaseUserToUser(result.user);
}

export async function loginWithGoogle(idToken: string): Promise<User> {
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  return firebaseUserToUser(result.user);
}

export async function loginWithApple(identityToken: string, nonce: string): Promise<User> {
  const credential = new OAuthProvider('apple.com').credential({
    idToken: identityToken,
    rawNonce: nonce,
  });
  const result = await signInWithCredential(auth, credential);
  return firebaseUserToUser(result.user);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(firebaseUser ? firebaseUserToUser(firebaseUser) : null);
  });
}
