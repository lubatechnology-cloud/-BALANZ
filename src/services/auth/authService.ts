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
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { auth } from '../firebase';
import { User } from '../types';

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'YOUR_WEB_CLIENT_ID';
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'YOUR_IOS_CLIENT_ID';
const APPLE_SERVICE_ID = process.env.EXPO_PUBLIC_APPLE_SERVICE_ID || 'YOUR_APPLE_SERVICE_ID';
const APPLE_REDIRECT_URI = process.env.EXPO_PUBLIC_APPLE_REDIRECT_URI || 'YOUR_REDIRECT_URI';

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

export async function loginWithGoogle(): Promise<User> {
  const request = new AuthSession.AuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
    scopes: ['openid', 'profile', 'email'],
    redirectUri: AuthSession.makeRedirectUri({
      scheme: 'balanz',
      path: 'google',
    }),
    responseType: AuthSession.ResponseType.Code,
  });

  const result = await AuthSession.useAuthSession(request, {
    prompt: AuthSession.Prompt.Login,
  });

  if (result.type !== 'success' || !result.authentication) {
    throw new Error('Google login cancelled');
  }

  const credential = GoogleAuthProvider.credential(result.authentication.idToken);
  const userCredential = await signInWithCredential(auth, credential);
  return firebaseUserToUser(userCredential.user);
}

export async function loginWithApple(): Promise<User> {
  const nonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    nonce
  );

  const request = new AuthSession.AuthRequest({
    clientId: APPLE_SERVICE_ID,
    scopes: ['name', 'email'],
    redirectUri: AuthSession.makeRedirectUri({
      scheme: 'balanz',
      path: 'apple',
    }),
    responseType: AuthSession.ResponseType.IdToken,
    nonce: hashedNonce,
  });

  const result = await AuthSession.useAuthSession(request, {
    prompt: AuthSession.Prompt.Login,
  });

  if (result.type !== 'success' || !result.authentication) {
    throw new Error('Apple login cancelled');
  }

  const credential = new OAuthProvider('apple.com').credential({
    idToken: result.authentication.idToken,
    rawNonce: nonce,
  });

  const userCredential = await signInWithCredential(auth, credential);
  return firebaseUserToUser(userCredential.user);
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

export async function updateDisplayName(displayName: string): Promise<void> {
  const user = auth.currentUser;
  if (user) {
    await updateProfile(user, { displayName });
  }
}

export async function updatePhotoURL(photoURL: string): Promise<void> {
  const user = auth.currentUser;
  if (user) {
    await updateProfile(user, { photoURL });
  }
}
