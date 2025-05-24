'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

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
  const [articles, setArticles] = useState<CategoryItem[]>([])
  const [category, setCategory] = useState('all')
  const [level, setLevel] = useState('all')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<'duration' | 'published_at'>('published_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    Promise.all(
      slugs.map((slug) =>
        fetch(`/data/category/category-${slug}.json`).then((res) => res.json()).catch(() => null)
      )
    ).then((results) => {
      setArticles(results.filter((a): a is CategoryItem => !!a))
    })
  }, [slugs])

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
      return matchCategory && matchLevel && matchSearch
    })
    .sort((a, b) => {
      const aVal = sortKey === 'duration' ? parseDuration(a.duration) : new Date(a.published_at).getTime()
      const bVal = sortKey === 'duration' ? parseDuration(b.duration) : new Date(b.published_at).getTime()
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    })

  return (
    <main className="p-6 max-w-5xl mx-auto text-black dark:text-white bg-white dark:bg-black min-h-screen">

      <h1 className="text-3xl font-bold mb-6">📚 Mochi English Articles</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded">
          <option value="all">All Categories</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={level} onChange={(e) => setLevel(e.target.value)} className="p-2 border rounded">
          <option value="all">All Levels</option>
          {allLevels.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or channel"
          className="p-2 border rounded flex-grow"
        />

        <select value={sortKey} onChange={(e) => setSortKey(e.target.value as any)} className="p-2 border rounded">
          <option value="published_at">Sort by: Date</option>
          <option value="duration">Sort by: Duration</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className="p-2 border rounded">
          <option value="desc">↓ Desc</option>
          <option value="asc">↑ Asc</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((a) => (
          <div key={a.slug} className="p-4 border rounded bg-white dark:bg-gray-800 text-black dark:text-white shadow hover:shadow-lg">
            <img src={a.thumbnail_url} alt="thumbnail" className="mb-3 w-full h-40 object-cover rounded" />
            <h2 className="text-xl font-semibold mb-1">{a.movie_title}</h2>
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
        ))}
      </div>
    </main>
  )
}
