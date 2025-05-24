'use client'

import { useEffect, useState } from 'react'

type QuizItem = {
  question: string
  choices: string[]
  answer: string
  explanation: string
}

type VocabItem = {
  word: string
  definition: string
  example: string
}

type Props = {
  movieTitle: string
  leadIntro: string
  quiz: QuizItem[]
  vocabulary: VocabItem[]
  videoId: string
  channelName: string
  category: string
  level: string
  duration?: string
  publishedAt?: string
}

export default function QuizLayout({
  movieTitle,
  leadIntro,
  quiz,
  vocabulary,
  videoId,
  channelName,
  category,
  level,
  duration,
  publishedAt,
}: Props) {
  const [quizIntro, setQuizIntro] = useState<string>('Let’s try a quiz!')
  const [vocabIntro, setVocabIntro] = useState<string>('Vocabulary from the video')
  const [quizTitle, setQuizTitle] = useState<string>('🧠 Quiz')
  const [vocabTitle, setVocabTitle] = useState<string>('📘 Vocabulary')
  const [videoTitle, setVideoTitle] = useState<string>('📺 Watch the Video')
  const [videoIntro, setVideoIntro] = useState<string>('Let’s watch the video that today’s quiz and vocabulary are based on.')

  useEffect(() => {
    fetch('/data/config/article-template.json')
      .then((res) => res.json())
      .then((config) => {
        setQuizIntro(config.quiz_intro || quizIntro)
        setVocabIntro(config.vocab_intro || vocabIntro)
        setQuizTitle(config.quiz_section_title || quizTitle)
        setVocabTitle(config.vocab_section_title || vocabTitle)
        setVideoTitle(config.video_section_title || videoTitle)
        setVideoIntro(config.video_intro || videoIntro)
      })
      .catch(() => {
        console.warn('No config found, using default intros.')
      })
  }, [])

  const formatDuration = (iso?: string): string => {
    if (!iso) return '–'
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return iso
    const [, h, m, s] = match.map(Number)
    const totalMinutes = (h || 0) * 60 + (m || 0)
    return `${totalMinutes}:${(s || 0).toString().padStart(2, '0')} min`
  }

  const formatDate = (iso?: string): string => {
    if (!iso) return '–'
    return new Date(iso).toLocaleDateString()
  }

  return (
    <main className="p-10 max-w-3xl mx-auto space-y-10 text-black dark:text-white bg-white dark:bg-black">
      <h1 className="text-3xl font-bold">{movieTitle}</h1>
      <p className="text-gray-600 dark:text-gray-300">{leadIntro}</p>

      <section>
        <h2 className="text-xl font-semibold mt-10 mb-2">{videoTitle}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">{videoIntro}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Channel: {channelName} / 📂 {category} / 🎯 {level}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          🕒 {formatDuration(duration)} / 📅 {formatDate(publishedAt)}
        </p>
        <div className="aspect-video">
          <iframe
            className="w-full h-full rounded"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-10 mb-2">{quizTitle}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{quizIntro}</p>
        {quiz.map((q, i) => (
          <div key={i} className="mb-6 p-4 rounded shadow bg-white dark:bg-gray-800 text-black dark:text-white">
            <p className="font-bold">{i + 1}. {q.question}</p>
            <ul className="list-disc ml-6 mt-2">
              {q.choices.map((c, j) => (
                <li key={j}>{c}</li>
              ))}
            </ul>
            <p className="mt-2 text-green-700 dark:text-green-300">Answer: {q.answer}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{q.explanation}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-10 mb-2">{vocabTitle}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{vocabIntro}</p>
        <ul className="space-y-4">
          {vocabulary.map((v, i) => (
            <li key={i} className="p-4 border rounded bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
              <p className="font-bold text-blue-700 dark:text-blue-400">{v.word}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{v.definition}</p>
              <p className="text-sm italic">"{v.example}"</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
