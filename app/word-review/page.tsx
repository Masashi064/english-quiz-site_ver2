'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface ReviewWord {
  id: string;
  word: string;
  meaning: string;
  example: string;
  easiness: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Timestamp;
  lastReviewed?: Timestamp;
}

export default function WordReviewPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reviewWords, setReviewWords] = useState<ReviewWord[]>([]);
  const [fetching, setFetching] = useState(true);
  const [lastReviewedWord, setLastReviewedWord] = useState<string | null>(null);
  const [lastReviewedMessage, setLastReviewedMessage] = useState<string | null>(null);


  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    const fetchReviewWords = async () => {
      if (!user) return;

      const favRef = collection(db, 'users', user.uid, 'favoriteWords');
      const favSnap = await getDocs(favRef);

      const today = new Date();
      const dueWords: ReviewWord[] = [];

      favSnap.forEach((doc) => {
        const d = doc.data();
        const word: ReviewWord = {
          id: doc.id,
          word: d.word,
          meaning: d.definition,
          example: d.example,
          easiness: d.easiness ?? 2.5,
          interval: d.interval ?? 1,
          repetitions: d.repetitions ?? 0,
          nextReviewDate: d.nextReviewDate ?? Timestamp.fromDate(today),
          lastReviewed: d.lastReviewed ?? null,
        };

        if (word.nextReviewDate.toDate() <= today) {
          dueWords.push(word);
        }
      });

      setReviewWords(dueWords);
      setFetching(false);
    };

    fetchReviewWords();
  }, [user]);

  const applySM2 = (
    score: number,
    easiness: number,
    repetitions: number,
    interval: number
  ) => {
    if (score < 3) return { easiness, repetitions: 0, interval: 1 };

    repetitions += 1;
    interval = repetitions === 1 ? 1 : repetitions === 2 ? 6 : Math.round(interval * easiness);
    easiness = Math.max(1.3, easiness + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02)));
    return { easiness, repetitions, interval };
  };

  const handleReview = async (score: number, word: ReviewWord) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'favoriteWords', word.id);
    const { easiness, repetitions, interval } = applySM2(
      score,
      word.easiness,
      word.repetitions,
      word.interval
    );
    const nextReviewDate = new Date(Date.now() + interval * 86400000);

    await updateDoc(ref, {
      easiness,
      repetitions,
      interval,
      lastReviewed: new Date(),
      nextReviewDate,
    });

    setLastReviewedMessage(`✅ "${word.word}" marked as reviewed!`);
    setReviewWords((prev) => prev.filter((w) => w.word !== word.word));
  };


  if (loading || fetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading your review words...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📚 Word Review Mode</h1>
      {reviewWords.length === 0 ? (
        <p className="text-green-600 font-medium">
          🎉 You've completed all your reviews for today!
        </p>
      ) : (
        <div className="grid gap-6">
          {lastReviewedMessage && (
            <div className="mb-4 text-green-600 text-sm font-medium">
              {lastReviewedMessage}
            </div>
          )}

          {reviewWords.map((word) => (
            <div
              key={word.id}
              className="border rounded p-4 shadow bg-white dark:bg-gray-800"
            >
              <h2 className="text-xl font-semibold mb-1">{word.word}</h2>
              <p className="text-gray-800 dark:text-gray-100">{word.meaning}</p>
              <p className="italic text-sm mt-1 text-gray-600 dark:text-gray-300">
                "{word.example}"
              </p>

              <div className="mt-4 flex gap-2 flex-wrap">
                {[0, 1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={() => handleReview(score, word)}
                    className="px-3 py-1 rounded font-medium transition transform active:scale-90 
                      bg-gray-200 text-black hover:bg-gray-300 
                      dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                  >
                    {score}
                  </button>
                ))}
              </div>

              {lastReviewedWord === word.word && (
                <p className="text-green-500 text-sm mt-2">✅ Marked as reviewed!</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
