import Image from 'next/image'
import Link from 'next/link'

type Article = {
  slug: string
  movie_title: string
  channel_name: string
  movie_url: string
  thumbnail_url: string
  duration: string
  published_at: string
  published_date?: string
}

// ISO 8601 duration to seconds
const parseDuration = (iso: string): number => {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const [, h, m, s] = match.map(Number)
  return (h || 0) * 3600 + (m || 0) * 60 + (s || 0)
}

const formatDuration = (iso: string): string => {
  const seconds = parseDuration(iso)
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')} min`
}

const formatDate = (iso: string): string => {
  return new Date(iso).toLocaleDateString()
}

export default function TopArticleList({ articles }: { articles: Article[] }) {
  const sorted = [...articles].sort((a, b) => {
    const aDate = new Date(a.published_date || a.published_at).getTime()
    const bDate = new Date(b.published_date || b.published_at).getTime()
    return bDate - aDate // ✅ 新しい順
  })

  return (
    <main className="px-4 py-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📅 Newest Articles First</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {sorted.map((a, index) => (
          <Link
            key={a.slug}
            href={`/article/${a.slug}`}
            className="block border rounded shadow hover:shadow-lg overflow-hidden bg-white dark:bg-gray-900"
          >
            <div className="relative w-full aspect-video">
              <Image
                src={`/img/img-${a.slug}.webp`}
                alt={a.movie_title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={index === 0}
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{a.movie_title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">Channel: {a.channel_name}</p>
              <p className="text-sm mt-1">
                🕒 {formatDuration(a.duration)} / 📅 {formatDate(a.published_date || a.published_at)}
              </p>
              <span className="inline-block mt-3 text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                ▶ Read article
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
