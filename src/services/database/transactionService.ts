import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Transaction } from '../types';

const COLLECTION = 'transactions';

export async function createTransaction(
  userId: string,
  transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Transaction> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...transaction,
    userId,
    date: Timestamp.fromDate(new Date(transaction.date)),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return {
    ...transaction,
    id: docRef.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function getTransactions(userId: string): Promise<Transaction[]> {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Transaction[];
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
    date: docSnap.data().date?.toDate(),
    createdAt: docSnap.data().createdAt?.toDate(),
    updatedAt: docSnap.data().updatedAt?.toDate(),
  } as Transaction;
}

export async function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteTransaction(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}
