import Link from 'next/link';
import { getLatestQuizzes } from '../lib/quiz'; 
import QuizCard from '../components/QuizCard';  

export default async function HomePage() {
  const latestQuizzes = await getLatestQuizzes(3); // 最新3件だけ取得

  return (
    <main className="p-6 max-w-4xl mx-auto">
      {/* イントロセクション */}
      <h1 className="text-3xl font-bold mb-4">SABACANで英語力をアップ！</h1>
      <p className="mb-2">動画で学べる英語クイズサイトです。気になるジャンルからクイズに挑戦しよう！</p>
      <p className="mb-6">
        <Link href="/how-to-use" className="text-blue-600 underline">
          使い方を詳しく見る →
        </Link>
      </p>

      {/* 最新記事セクション */}
      <section>
        <h2 className="text-xl font-semibold mb-3">🆕 最新のクイズ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestQuizzes.map((quiz) => (
            <QuizCard key={quiz.slug} {...quiz} />
          ))}
        </div>

        <div className="text-center mt-6">
          <Link href="/articles">
            <button className="btn-primary mt-4">もっと見る ➜</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
