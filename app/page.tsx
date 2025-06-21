import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import Link from 'next/link';

type QuizMeta = {
  slug: string;
  title: string;
  channel: string;
  publishedAt: string;
  thumbnail: string;
};

function getLatestQuizzes(count: number): QuizMeta[] {
  const dir = path.join(process.cwd(), 'public/data/category');
  const files = fs.readdirSync(dir);

  const items: QuizMeta[] = files
    .filter((f) => f.endsWith('.json'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      const data = JSON.parse(raw);
      return {
        slug: data.slug,
        title: data.movie_title,
        channel: data.channel_name,
        publishedAt: data.published_at,
        thumbnail: `/img/img-${data.slug}.jpg`,
      };
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);

  return items;
}

export default function HomePage() {
  const latest = getLatestQuizzes(3);

  return (
    <main className="p-6 max-w-5xl mx-auto text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Learn English with SABACAN</h1>
      <p className="mb-2">Enjoy interactive quizzes based on real English videos. Choose a topic and start learning today!</p>
      <p className="mb-6">
        <Link href="/how-to-use" className="text-blue-600 underline">
          Learn how it works →
        </Link>
      </p>

      <section>
        <h2 className="text-xl font-semibold mb-3">🆕 Latest Quizzes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((item, index) => (
            <Link
              key={item.slug}
              href={`/article/${item.slug}`}
              className="block border rounded shadow hover:shadow-lg overflow-hidden"
            >
              <Image
                src={item.thumbnail}
                alt={item.title}
                width={480}
                height={270}
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">Channel: {item.channel}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/articles">
            <button className="btn-primary">Browse All Quizzes ➜</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
