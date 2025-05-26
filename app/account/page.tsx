'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

interface QuizRecord {
  date: { seconds: number };
  title: string;
  url: string;
  channel: string;
  category: string;
  level: string;
  score: string;
}

interface FavoriteWord {
  word: string;
  meaning: string;
  example: string;
}

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizRecord[]>([]);
  const [favoriteWords, setFavoriteWords] = useState<FavoriteWord[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

useEffect(() => {
  const fetchData = async () => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      setNickname(data.nickname || '');
      if (data.createdAt?.seconds) {
        const date = new Date(data.createdAt.seconds * 1000);
        setCreatedAt(date.toLocaleDateString());
      }
    }

    // 🔄 クイズ履歴の読み込み（quizResults に修正）
    const quizRef = collection(db, 'users', user.uid, 'quizResults');
    const quizSnap = await getDocs(quizRef);
    const history: QuizRecord[] = [];
    quizSnap.forEach((doc) => {
      const q = doc.data();
      history.push({
        date: q.timestamp || { seconds: 0 },
        title: q.movieTitle,
        url: `https://youtube.com/watch?v=${q.videoId}`,
        channel: q.channelName,
        category: q.category,
        level: q.level,
        score: `${q.score}/${q.total}`,
      });
    });
    setQuizHistory(history);

    // 🔄 お気に入り単語（favoriteWords に修正）
    const favRef = collection(db, 'users', user.uid, 'favoriteWords');
    const favSnap = await getDocs(favRef);
    const favs: FavoriteWord[] = [];
    favSnap.forEach((doc) => {
      const d = doc.data();
      favs.push({
        word: d.word,
        meaning: d.definition,
        example: d.example,
      });
    });
    setFavoriteWords(favs);

    setFetching(false);
  }

  fetchData();
}, [user]);


  if (loading || fetching) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
        Loading account...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">My Account</h1>

        <section className="mb-6">
          <p><strong>Nickname:</strong> {nickname}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>User ID:</strong> {user?.uid}</p>
          <p><strong>Created At:</strong> {createdAt || '—'}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">📊 Quiz History</h2>
          {quizHistory.length === 0 ? (
            <p>No quiz history yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Channel</th>
                    <th className="text-left p-2">Category</th>
                    <th className="text-left p-2">Level</th>
                    <th className="text-left p-2">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {quizHistory.map((quiz, i) => (
                    <tr key={i} className="border-b dark:border-gray-700">
                      <td className="p-2">{new Date(quiz.date.seconds * 1000).toLocaleDateString()}</td>
                      <td className="p-2">
                        <a href={quiz.url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {quiz.title}
                        </a>
                      </td>
                      <td className="p-2">{quiz.channel}</td>
                      <td className="p-2">{quiz.category}</td>
                      <td className="p-2">{quiz.level}</td>
                      <td className="p-2">{quiz.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">💡 Favorite Words</h2>
          {favoriteWords.length === 0 ? (
            <p>No favorite words yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {favoriteWords.map((word, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow-sm">
                  <div className="font-bold text-lg">{word.word}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {word.meaning}
                  </div>
                  <div className="text-xs mt-1 italic text-gray-500 dark:text-gray-400">
                    {word.example}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
