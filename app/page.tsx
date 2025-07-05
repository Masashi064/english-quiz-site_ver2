import articles from './data/all-articles.json';
import Image from 'next/image';
import Link from 'next/link';
import heroImage from './assets/top-img1.webp';

export default function HomePage() {
  const latest = articles
    .sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime())
    .slice(0, 24);

  return (
    <main className="text-black dark:text-white">
      {/* ① Hero セクション */}
      <section className="relative h-[75vh] flex items-center justify-center text-white text-center overflow-hidden">
        <Image src={heroImage} alt="Hero" fill className="object-cover opacity-70" priority />
        <div className="z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">Learn English with Fun Video Quizzes</h1>
          <p className="mt-4 text-lg md:text-xl drop-shadow">Real YouTube content × Smart Learning</p>
          <Link href="/top">
            <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg text-lg">
              Try Your First Quiz ➜
            </button>
          </Link>
        </div>
      </section>

      {/* ② 実績セクション */}
      <section className="bg-white dark:bg-gray-800 py-12 text-center">
        <h2 className="text-2xl font-bold mb-6">SABACAN in Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">
          <div><strong className="text-3xl text-blue-500">+100</strong><p>動画クイズ</p></div>
          <div><strong className="text-3xl text-blue-500">800+</strong><p>英単語登録</p></div>
          <div><strong className="text-3xl text-blue-500">TOEIC 800↑</strong><p>対象レベル</p></div>
        </div>
      </section>

      {/* ③ 特徴セクション */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-8">Why SABACAN?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl mb-4">🎧</div>
            <h3 className="text-lg font-semibold mb-2">Listening Practice</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Real YouTube videos with English quizzes.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-lg font-semibold mb-2">Learn Vocabulary</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Master words with built-in word lists and review.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-lg font-semibold mb-2">Track Your Progress</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">See your history and review difficult words.</p>
          </div>
        </div>
      </section>

      {/* ④ 最新クイズ */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">🆕 Latest Quizzes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((item, index) => (
            <Link
              key={item.slug}
              href={`/article/${item.slug}`}
              className="block border rounded shadow hover:shadow-lg overflow-hidden"
            >
              <div className="relative w-full aspect-video">
                <Image
                  src={`/img/img-${item.slug}.webp`}
                  alt={item.movie_title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index === 0}
                  className="object-cover rounded-t"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{item.movie_title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Channel: {item.channel_name}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/top">
            <button className="btn-primary">Browse All Quizzes ➜</button>
          </Link>
        </div>
      </section>

      {/* ⑤ How it works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 text-center">
        <h2 className="text-2xl font-bold mb-8">How SABACAN Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto text-left px-4">
          <div>
            <div className="text-3xl mb-2">🎥</div>
            <h3 className="font-semibold">1. 動画を見る</h3>
            <p className="text-sm">ネイティブの自然な英語を使った動画をチェック</p>
          </div>
          <div>
            <div className="text-3xl mb-2">❓</div>
            <h3 className="font-semibold">2. クイズに挑戦</h3>
            <p className="text-sm">理解力・リスニング力をその場でテスト</p>
          </div>
          <div>
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-semibold">3. 単語を覚える</h3>
            <p className="text-sm">クイズに出た語彙は自動で単語帳に登録</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🔁</div>
            <h3 className="font-semibold">4. 復習する</h3>
            <p className="text-sm">SM2方式で効率よく記憶に定着</p>
          </div>
        </div>
      </section>

      {/* ⑥ CTA */}
      <section className="text-center py-16 bg-blue-600 text-white px-4">
        <h2 className="text-2xl font-bold mb-4">Are You Ready to Boost Your English?</h2>
        <p className="mb-6">今すぐ始めて、クイズで楽しく学びましょう！</p>
        <Link href="/top">
          <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold text-lg hover:bg-gray-100">
            Explore All Quizzes
          </button>
        </Link>
      </section>

      {/* ⑦ Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        © 2025 SABACAN365.com | Learn English the Fun Way
      </footer>
    </main>
  );
}
