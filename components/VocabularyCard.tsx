import { useState, useEffect } from 'react'

type VocabItem = {
  word: string
  definition: string
  example: string
}

type Props = {
  item: VocabItem
}

export default function VocabularyCard({ item }: Props) {
  const [flipped, setFlipped] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleFavorite = () => {
    const key = `favorite-${item.word}`
    const newState = !isFavorite
    setIsFavorite(newState)
    localStorage.setItem(key, JSON.stringify(newState))
  }

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = 'en-US'
    speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    const saved = localStorage.getItem(`favorite-${item.word}`)
    if (saved) {
      setIsFavorite(JSON.parse(saved))
    }
  }, [item.word])

  return (
    <div className="relative w-full cursor-pointer" onClick={() => setFlipped(!flipped)}>
      <div className={`transition-transform duration-500 transform perspective preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded border border-gray-300 dark:border-gray-600 backface-hidden">
          <div className="flex justify-between items-center">
            <p className="font-bold text-lg text-blue-700 dark:text-blue-400">{item.word}</p>
            <div className="flex items-center gap-2">
              <button
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
                onClick={(e) => { e.stopPropagation(); speakWord(item.word) }}
              >
                🔊
              </button>
              <button
                className="text-red-500 text-lg hover:text-red-700"
                onClick={(e) => { e.stopPropagation(); toggleFavorite() }}
              >
                {isFavorite ? '♥' : '♡'}
              </button>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-gray-900 p-4 rounded border border-gray-300 dark:border-gray-600 rotate-y-180 backface-hidden">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <strong>Meaning:</strong> {item.definition}
          </p>
          <p className="text-sm italic text-gray-600 dark:text-gray-400">"{item.example}"</p>
        </div>
      </div>
    </div>
  )
}
