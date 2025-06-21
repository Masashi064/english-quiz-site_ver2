import heroImage from './assets/top-img1.webp'; 
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
    <main className="text-black dark:text-white">
      {/* ✅ Hero with overlay text */}
      <section className="relative w-full h-[400px] sm:h-[500px]">
        <Image
          src={heroImage}
          alt="Hero"
          fill
          placeholder="blur"
          priority
          sizes="100vw"
          className="object-cover brightness-90"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-3xl sm:text-5xl font-bold drop-shadow mb-4">
            Learn Real English Through Fun Quizzes
          </h1>
          <p className="text-lg sm:text-xl drop-shadow mb-4">
            Enjoy interactive quizzes based on real videos from YouTube and more.
          </p>
          <Link
            href="/how-to-use"
            className="inline-block bg-white text-blue-700 px-6 py-2 rounded-full text-sm sm:text-base font-semibold hover:bg-gray-100 shadow"
          >
            ➜ Learn how it works
          </Link>
        </div>
      </section>

      {/* 🆕 Latest Quizzes */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">🆕 Latest Quizzes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((item, index) => (
            <Link
              key={item.slug}
              href={`/article/${item.slug}`}
              className="block border rounded shadow hover:shadow-lg overflow-hidden"
            >
              <Image
                src={`/img/img-${item.slug}.webp`}
                alt={item.title}
                width={480}
                height={270}
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-40 object-cover"
                unoptimized={false}
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
