'use client';

import { useTheme } from '@/context/ThemeContext'; 
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import VocabularyCard from '@/components/VocabularyCard';

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
  const [quizStats, setQuizStats] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState('My Account');

  const sortedHistory = [...quizHistory].sort((a, b) => b.date.seconds - a.date.seconds);

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
          slug: q.slug,
        });
      });
      setQuizHistory(history);
      calculateStatistics(history);

      const favRef = collection(db, 'users', user.uid, 'favoriteWords');
      const favSnap = await getDocs(favRef);
      const favs: FavoriteWord[] = [];
      favSnap.forEach((doc) => {
        const d = doc.data();
        favs.push({ word: d.word, meaning: d.definition, example: d.example });
      });
      setFavoriteWords(favs);

      setFetching(false);
    };

    fetchData();
  }, [user]);

  function calculateStatistics(quizHistory: QuizRecord[]) {
    const stats = {
      totalQuizzes: quizHistory.length,
      totalCorrect: 0,
      totalQuestions: 0,
      categoryStats: {} as Record<string, { count: number; correct: number }>,
      levelStats: {} as Record<string, { count: number; correct: number }>,
    };

    for (const quiz of quizHistory) {
      const [correct, total] = quiz.score.split('/').map(Number);
      stats.totalCorrect += correct;
      stats.totalQuestions += total;

      if (!stats.categoryStats[quiz.category]) {
        stats.categoryStats[quiz.category] = { count: 0, correct: 0 };
      }
      stats.categoryStats[quiz.category].count += 1;
      stats.categoryStats[quiz.category].correct += correct;

      if (!stats.levelStats[quiz.level]) {
        stats.levelStats[quiz.level] = { count: 0, correct: 0 };
      }
      stats.levelStats[quiz.level].count += 1;
      stats.levelStats[quiz.level].correct += correct;
    }

    setQuizStats(stats);
  }

  if (loading || fetching) {
    return <div className="flex justify-center items-center min-h-screen">Loading account...</div>;
  }

  const tabs = ['My Account', 'Summary', 'Quiz History', 'Favorite Words'];

    return (
    <div className="min-h-screen px-2 py-10">
      <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6">
        <ul className="flex flex-wrap justify-center gap-2 border-b mb-6">
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                className={`px-4 py-2 border-b-2 ${activeTab === tab ? 'border-blue-500 font-bold' : 'border-transparent'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>

        {activeTab === 'My Account' && (
          <section className="mb-6">
            <p><strong>Nickname:</strong> {nickname}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>User ID:</strong> {user?.uid}</p>
            <p><strong>Created At:</strong> {createdAt || '—'}</p>
          </section>
        )}

        {activeTab === 'Summary' && quizStats && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">📈 Quiz Summary</h2>
            <p>Total Quizzes: {quizStats.totalQuizzes}</p>
            <p>Total Correct Answers: {quizStats.totalCorrect}</p>
            <p>Total Questions: {quizStats.totalQuestions}</p>
            <p>Average Score (out of 5): {(quizStats.totalCorrect / quizStats.totalQuestions * 5).toFixed(2)}</p>

            <h3 className="mt-4 font-semibold">Category Stats:</h3>
            <ul className="list-disc list-inside">
              {Object.entries(quizStats.categoryStats).map(([category, data]) => {
                const typedData = data as { count: number; correct: number }
                return (
                  <li key={category}>
                    {category}: {typedData.correct} correct out of {typedData.count} quizzes
                  </li>
                );
              })}
            </ul>

            <h3 className="mt-4 font-semibold">Level Stats:</h3>
            <ul className="list-disc list-inside">
              {Object.entries(quizStats.levelStats).map(([level, data]) => {
                const typedData = data as { count: number; correct: number }
                return (
                  <li key={level}>
                    {level}: {typedData.correct} correct answers from {typedData.count} quizzes
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {activeTab === 'Quiz History' && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">📊 Quiz History</h2>
            {quizHistory.length === 0 ? (
              <p>No quiz history yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-sm">
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
        )}

        {activeTab === 'Favorite Words' && (
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
        )}
      </div>
    </div>
  );
}
