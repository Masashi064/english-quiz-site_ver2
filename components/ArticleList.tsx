'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

type CategoryItem = {
  slug: string
  movie_title: string
  assigned_category: string
  assigned_level: string
  channel_name: string
  movie_url: string
  thumbnail_url: string
  duration: string
  published_at: string
}

const allCategories = [
  'science', 'conversation', 'news', 'technology', 'education',
  'psychology', 'culture', 'history', 'lifestyle'
]
const allLevels = ['beginner', 'intermediate', 'upper-intermediate', 'advanced']

export default function ArticleList({ slugs }: { slugs: string[] }) {
  const { user } = useAuth()
  const [articles, setArticles] = useState<CategoryItem[]>([])
  const [category, setCategory] = useState('all')
  const [level, setLevel] = useState('all')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<'duration' | 'published_at'>('published_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'uncompleted'>('all')
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([])
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [levelCounts, setLevelCounts] = useState<Record<string, number>>({})
  const [completedCount, setCompletedCount] = useState(0)
  const [uncompletedCount, setUncompletedCount] = useState(0)

  // 🔁 クイズ履歴の取得
  useEffect(() => {
    Promise.all(
      slugs.map((slug) =>
        fetch(`/data/category/category-${slug}.json`)
          .then((res) => res.json())
          .catch(() => null)
      )
    ).then((results) => {
      const loaded = results.filter((a): a is CategoryItem => !!a)
      setArticles(loaded)

      // 🔢 カテゴリ・レベルごとの件数をカウント
      const catCounts: Record<string, number> = {}
      const lvlCounts: Record<string, number> = {}

      loaded.forEach((a) => {
        catCounts[a.assigned_category] = (catCounts[a.assigned_category] || 0) + 1
        lvlCounts[a.assigned_level] = (lvlCounts[a.assigned_level] || 0) + 1
      })

      setCategoryCounts(catCounts)
      setLevelCounts(lvlCounts)

      // ✅ ここが今回追加する completed/uncompleted カウント処理
      const completed = loaded.filter((a) => completedSlugs.includes(a.slug)).length
      const uncompleted = loaded.length - completed
      setCompletedCount(completed)
      setUncompletedCount(uncompleted)
    })
  }, [slugs, completedSlugs])


  // 🔁 記事データの読み込み
  useEffect(() => {
    Promise.all(
      slugs.map((slug) =>
        fetch(`/data/category/category-${slug}.json`).then((res) => res.json()).catch(() => null)
      )
    ).then((results) => {
      setArticles(results.filter((a): a is CategoryItem => !!a))
    })
  }, [slugs])

  useEffect(() => {
  Promise.all(
    slugs.map((slug) =>
      fetch(`/data/category/category-${slug}.json`).then((res) => res.json()).catch(() => null)
    )
  ).then((results) => {
    const loaded = results.filter((a): a is CategoryItem => !!a)
    setArticles(loaded)

    // 🔢 件数カウント
    const catCounts: Record<string, number> = {}
    const lvlCounts: Record<string, number> = {}

    loaded.forEach(a => {
      catCounts[a.assigned_category] = (catCounts[a.assigned_category] || 0) + 1
      lvlCounts[a.assigned_level] = (lvlCounts[a.assigned_level] || 0) + 1
    })

    setCategoryCounts(catCounts)
    setLevelCounts(lvlCounts)
  })
}, [slugs])

useEffect(() => {
  const fetchCompletedSlugs = async () => {
    if (!user) return
    const quizRef = collection(db, 'users', user.uid, 'quizResults')
    const quizSnap = await getDocs(quizRef)
    const completed: string[] = []
    quizSnap.forEach(doc => {
      const data = doc.data()
      if (data.slug) completed.push(data.slug)
    })
    setCompletedSlugs(completed)
  }
  fetchCompletedSlugs()
}, [user])


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

  const filtered = articles
    .filter((a) => {
      const matchCategory = category === 'all' || a.assigned_category === category
      const matchLevel = level === 'all' || a.assigned_level === level
      const matchSearch =
        a.movie_title.toLowerCase().includes(search.toLowerCase()) ||
        a.channel_name.toLowerCase().includes(search.toLowerCase())

      const isCompleted = completedSlugs.includes(a.slug)
      const matchCompletion =
        completionFilter === 'all' ||
        (completionFilter === 'completed' && isCompleted) ||
        (completionFilter === 'uncompleted' && !isCompleted)

      return matchCategory && matchLevel && matchSearch && matchCompletion
    })
    .sort((a, b) => {
      const aVal = sortKey === 'duration' ? parseDuration(a.duration) : new Date(a.published_at).getTime()
      const bVal = sortKey === 'duration' ? parseDuration(b.duration) : new Date(b.published_at).getTime()
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    })

  return (
    <main className="p-6 max-w-5xl mx-auto text-black dark:text-white bg-white dark:bg-black min-h-screen">
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 px-3 border rounded text-sm bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 appearance-none"
        >
          <option value="all">All Categories ({articles.length})</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c} ({categoryCounts[c] || 0})
            </option>
          ))}
        </select>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="h-10 px-3 border rounded text-sm bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 appearance-none"
        >
          <option value="all">All Levels ({articles.length})</option>
          {allLevels.map((l) => (
            <option key={l} value={l}>
              {l} ({levelCounts[l] || 0})
            </option>
          ))}
        </select>

        <select
          value={completionFilter}
          onChange={(e) => setCompletionFilter(e.target.value as any)}
          className="h-10 px-3 border rounded text-sm bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 appearance-none"
        >
          <option value="all">All Status ({articles.length})</option>
          <option value="uncompleted">Not attempted ({uncompletedCount})</option>
          <option value="completed">Completed ({completedCount})</option>
        </select>

        
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or channel"
          className="p-2 border rounded flex-grow bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as any)}
          className="p-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 appearance-none"
        >
          <option value="published_at">Sort by: Date</option>
          <option value="duration">Sort by: Duration</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
          className="p-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 appearance-none"
        >
          <option value="desc">↓ Desc</option>
          <option value="asc">↑ Asc</option>
        </select>

        <button
          onClick={() => {
            setCategory('all')
            setLevel('all')
            setCompletionFilter('all')
            setSearch('')
            setSortKey('published_at')
            setSortOrder('desc')
          }}
          className="h-10 px-4 rounded text-sm bg-gray-200 text-black dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Reset Filters
        </button>


      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((a, index) => {
          const isCompleted = completedSlugs.includes(a.slug)

          const cardStyle = isCompleted
            ? 'p-4 border rounded relative shadow hover:shadow-lg bg-green-100 border-green-500 dark:bg-green-500/30 dark:border-green-400 text-black dark:text-white'
            : 'p-4 border rounded relative shadow hover:shadow-lg bg-white dark:bg-gray-800 text-black dark:text-white'

          return (
            <div key={a.slug} className={cardStyle}>
              {isCompleted && (
                <div className="absolute bottom-0 right-0 bg-green-600 text-white px-2">
                  ✅ Completed
                </div>
              )}
              <Link href={`/article/${a.slug}`} className="block hover:opacity-80 transition">
                <Image
                  src={`/img/img-${a.slug}.jpg`}
                  alt="thumbnail"
                  width={480}
                  height={270}
                  className="mb-3 w-full h-40 object-cover rounded"
                  priority={index < 1}
                />
                <h2 className="text-xl font-semibold mb-1">{a.movie_title}</h2>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-300">Channel: {a.channel_name}</p>
              <p className="text-sm mt-1">📂 {a.assigned_category} / 🎯 {a.assigned_level}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">🕒 {formatDuration(a.duration)} / 📅 {formatDate(a.published_at)}</p>
              <Link
                href={`/article/${a.slug}`}
                className="inline-block mt-4 text-blue-600 dark:text-blue-300 font-semibold hover:underline"
              >
                ▶ Read article
              </Link>
            </div>
          )
        })}
      </div>
    </main>
  )
}
