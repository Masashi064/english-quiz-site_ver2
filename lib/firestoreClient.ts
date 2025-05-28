import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export const getUserQuizHistory = async (uid: string) => {
  const ref = collection(db, `users/${uid}/quizResults`);
  const q = query(ref, orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data());
};

export const getUserFavorites = async (uid: string) => {
  const ref = collection(db, `users/${uid}/favoriteWords`);
  const snap = await getDocs(ref);
  return snap.docs.map((doc) => doc.data());
};
