'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import QuizLayout from '@/components/QuizLayout'

export default function ArticlePage() {
  const params = useParams()
  const slug = typeof params?.slug === 'string' ? params.slug : ''

  const [quizData, setQuizData] = useState<any>(null)
  const [vocabData, setVocabData] = useState<any>(null)

  useEffect(() => {
    if (!slug) return

    fetch(`/data/quiz/quiz-${slug}.json`)
      .then((res) => res.json())
      .then((data) => setQuizData(data))

    fetch(`/data/vocab/vocab-${slug}.json`)
      .then((res) => res.json())
      .then((data) => setVocabData(data))
  }, [slug])

  if (!quizData || !vocabData) {
    return <p className="p-10 text-center">Loading...</p>
  }

  return (
    <QuizLayout
      movieTitle={quizData.movie_title}
      leadIntro={quizData.lead_intro}
      quiz={quizData.quiz}
      vocabulary={vocabData.vocabulary}
    />
  )
}
