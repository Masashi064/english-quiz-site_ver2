'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import QuizLayout from '@/components/QuizLayout'

export default function ArticlePage() {
  const params = useParams()
  const slug = typeof params?.slug === 'string' ? params.slug : ''

  const [quizData, setQuizData] = useState<any>(null)
  const [vocabData, setVocabData] = useState<any>(null)
  const [categoryData, setCategoryData] = useState<any>(null)

  useEffect(() => {
    if (!slug) return

    fetch(`/data/quiz/quiz-${slug}.json`)
      .then((res) => res.json())
      .then((data) => setQuizData(data))

    fetch(`/data/vocab/vocab-${slug}.json`)
      .then((res) => res.json())
      .then((data) => setVocabData(data))

    fetch(`/data/category/category-${slug}.json`)
      .then((res) => res.json())
      .then((data) => setCategoryData(data))
  }, [slug])

  if (!quizData || !vocabData || !categoryData) {
    return <p className="p-10 text-center">Loading...</p>
  }

  return (
    <QuizLayout
      slug={slug} // ✅ 追加
      movieTitle={quizData.movie_title}
      leadIntro={quizData.lead_intro}
      quiz={quizData.quiz}
      vocabulary={vocabData.vocabulary}
      videoId={categoryData.video_id}
      channelName={categoryData.channel_name}
      category={categoryData.assigned_category}
      level={categoryData.assigned_level}
      duration={categoryData.duration}
      publishedAt={categoryData.published_at}
    />
  )
}
