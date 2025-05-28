'use client';

import { useTheme } from '@/context/ThemeContext'; 
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import VocabularyCard from '@/components/VocabularyCard' 

interface QuizRecord {
  date: { seconds: number };
  title: string;
  url: string;
  channel: string;
  category: string;
  level: string;
  score: string;
  slug: string;
}

interface FavoriteWord {
  word: string;
  meaning: string;
  example: string;
}

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme(); 


  const [nickname, setNickname] = useState('');
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizRecord[]>([]);
  const [favoriteWords, setFavoriteWords] = useState<FavoriteWord[]>([]);
  const [fetching, setFetching] = useState(true);

  const sortedHistory = [...quizHistory].sort((a, b) => b.date.seconds - a.date.seconds)


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

    const quizRef = collection(db, 'users', user.uid, 'quizResults');
    const quizSnap = await getDocs(quizRef);
    const history: QuizRecord[] = [];
    quizSnap.forEach((doc) => {
      const q = doc.data();
      history.push({
        date: q.timestamp || { seconds: 0 },
        title: q.movieTitle,
        url: `/article/${q.slug}`,
        channel: q.channelName,
        category: q.category,
        level: q.level,
        score: `${q.score}/${q.total}`,
        slug: q.slug
      });
    });
    setQuizHistory(history);

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
  };

  fetchData(); // ← useEffect の中に正しく配置
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

        <div className="mb-4 flex items-center">
          <span className="mr-2">🌞</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
          <span className="ml-2">🌙</span>
        </div>


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
                  {sortedHistory.map((quiz, i) => (
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
                <VocabularyCard
                  key={i}
                  item={{
                    word: word.word,
                    definition: word.meaning,
                    example: word.example,
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
