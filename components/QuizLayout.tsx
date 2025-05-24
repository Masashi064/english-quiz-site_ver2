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
}

export default function QuizLayout({ movieTitle, leadIntro, quiz, vocabulary }: Props) {
  const [quizIntro, setQuizIntro] = useState<string>('Let’s try a quiz!')
  const [vocabIntro, setVocabIntro] = useState<string>('Vocabulary from the video')
  const [quizTitle, setQuizTitle] = useState<string>('🧠 Quiz')
  const [vocabTitle, setVocabTitle] = useState<string>('📘 Vocabulary')

  useEffect(() => {
    fetch('/data/config/article-template.json')
      .then((res) => res.json())
      .then((config) => {
        setQuizIntro(config.quiz_intro || quizIntro)
        setVocabIntro(config.vocab_intro || vocabIntro)
        setQuizTitle(config.quiz_section_title || quizTitle)
        setVocabTitle(config.vocab_section_title || vocabTitle)
      })
      .catch(() => {
        console.warn('No config found, using default intros.')
      })
  }, [])

  return (
    <main className="p-10 max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold">{movieTitle}</h1>
      <p className="text-gray-600">{leadIntro}</p>

      <section>
        <h2 className="text-xl font-semibold mt-10 mb-2">{quizTitle}</h2>
        <p className="text-gray-700 mb-4">{quizIntro}</p>
        {quiz.map((q, i) => (
          <div key={i} className="mb-6 p-4 bg-white shadow rounded">
            <p className="font-bold">{i + 1}. {q.question}</p>
            <ul className="list-disc ml-6 mt-2">
              {q.choices.map((c, j) => (
                <li key={j}>{c}</li>
              ))}
            </ul>
            <p className="mt-2 text-green-700">Answer: {q.answer}</p>
            <p className="text-sm text-gray-600">{q.explanation}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-10 mb-2">{vocabTitle}</h2>
        <p className="text-gray-700 mb-4">{vocabIntro}</p>
        <ul className="space-y-4">
          {vocabulary.map((v, i) => (
            <li key={i} className="p-4 border rounded bg-gray-50">
              <p className="font-bold text-blue-700">{v.word}</p>
              <p className="text-sm text-gray-600">{v.definition}</p>
              <p className="text-sm italic">"{v.example}"</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
