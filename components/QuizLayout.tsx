'use client'

import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'

import { useEffect, useState } from 'react'
import VocabularyCard from './VocabularyCard'
import { useMemo } from 'react'


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
  slug: string
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
  slug,  // ✅ これを追加
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
  const { user } = useAuth()
  const [answers, setAnswers] = useState<(string | null)[]>(Array(quiz.length).fill(null))
  const [saved, setSaved] = useState(false)

  const handleAnswer = async (questionIndex: number, choice: string) => {
    if (answers[questionIndex] !== null) return
    const newAnswers = [...answers]
    newAnswers[questionIndex] = choice
    setAnswers(newAnswers)

    const allAnswered = newAnswers.every((a) => a !== null)
    if (allAnswered && user && !saved) {
      setSaved(true)
      await addDoc(collection(db, `users/${user.uid}/quizResults`), {
        userId: user.uid,
        slug,
        videoId,
        movieTitle,
        score: newAnswers.filter((a, i) => a === quiz[i].answer).length,
        total: quiz.length,
        category,
        level,
        channelName,
        timestamp: serverTimestamp(),
        referrer: document.referrer || 'direct',
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenWidth: window.innerWidth,
        version: 'quiz-v1.2.0',
      })
    }
  }

  const score = answers.filter((a, i) => a === quiz[i].answer).length
  const allAnswered = answers.every((a) => a !== null)

  return (
    <main className="+ px-4 py-10 max-w-3xl mx-auto space-y-10 text-black dark:text-white bg-white dark:bg-black">
      <h1 className="text-3xl font-bold">{movieTitle}</h1>
      <p className="text-gray-600 dark:text-gray-300">{leadIntro}</p>

      <section>
        <h2 className="text-xl font-semibold mt-10 mb-2">📺 Watch the Video</h2>
        <div className="aspect-video mb-4">
          <iframe
            className="w-full h-[315px] rounded"
            src={`https://www.youtube.com/embed/${videoId}?cc_load_policy=1&rel=0&modestbranding=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Channel: {channelName} / 📂 {category} / 🎯 {level}<br />
          ⏱ Duration: {duration} / 📅 Published: {publishedAt ? new Date(publishedAt).toLocaleDateString() : 'N/A'}
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-10 mb-2">🧠 Quiz</h2>
        {quiz.map((q, i) => {
          const selected = answers[i]
          const isCorrect = selected === q.answer
          const shuffledChoices = useMemo(() => {
            const copy = [...q.choices];
            for (let i = copy.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [copy[i], copy[j]] = [copy[j], copy[i]];
            }
            return copy;
          }, [q.question]); // 問題が変わったときだけシャッフルされる
          const boxStyle = selected
            ? isCorrect
              ? 'bg-green-100 border-green-500 dark:bg-green-500/30 dark:border-green-400'
              : 'bg-red-100 border-red-500 dark:bg-red-500/30 dark:border-red-400'
            : 'bg-white dark:bg-gray-800 border dark:border-gray-700'

          return (
            <div key={i} className={`mb-6 p-4 rounded shadow ${boxStyle}`}>
              <p className="font-bold mb-2">{i + 1}. {q.question}</p>
              <ul className="space-y-2">
               {shuffledChoices.map((c, j) => (
                  <li
                    key={j}
                    className="p-2 border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleAnswer(i, c)}
                  >
                    {c}
                  </li>
                ))}
              </ul>
              {selected && (
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  <p className="font-semibold text-green-700 dark:text-green-300">Answer: {q.answer}</p>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
        {allAnswered && (
          <>
            <p className="text-lg font-bold text-center text-blue-700 dark:text-blue-300 mt-4">
              ✅ Your Score: {score} / {quiz.length}
            </p>
            <div className="text-center mt-4">
              <a
                href="/articles"
                className="text-blue-600 dark:text-blue-400 underline font-semibold"
              >
                👉 Try the next quiz!
              </a>
            </div>
          </>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-10 mb-2">📘 Vocabulary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vocabulary
            .filter((v) => v && v.word && v.definition && v.example)
            .map((v, i) => (
              <VocabularyCard key={i} item={v} />
            ))}
        </div>
                <div className="text-center mt-6">
          <a
            href="/articles"
            className="text-blue-600 dark:text-blue-400 underline font-semibold"
          >
            👉 Ready for another quiz?
          </a>
        </div>
      </section>
    </main>
  )
}
