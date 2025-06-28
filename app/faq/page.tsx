// app/faq/page.tsx

export const metadata = {
  title: 'FAQ | SABACAN',
  description: 'Frequently Asked Questions about SABACAN – learn how to use the site, solve common issues, and get support.',
}

export default function FAQPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">❓ FAQ – Frequently Asked Questions</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-2">💡 What is SABACAN?</h2>
          <p>
            SABACAN is an English learning platform using real YouTube videos and interactive quizzes.
            You can improve your listening, vocabulary, and comprehension skills in a fun and effective way.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">📲 Can I use SABACAN on my phone?</h2>
          <p>
            Yes! SABACAN is mobile-friendly. You can practice anytime, anywhere—whether you're commuting, taking a break, or studying on the go.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">📝 Do I need to register?</h2>
          <p>
            You can use most of the site without registering. However, by signing up, you can save your quiz history and favorite words.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">🧠 Are the quizzes difficult?</h2>
          <p>
            No worries! Quizzes are designed for various levels: beginner, intermediate, and advanced. You can filter content by level.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">🔐 Is my data safe?</h2>
          <p>
            We use Firebase Authentication and Firestore. Your data is only used to improve your learning experience and is never shared with third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">🌐 Can I view the site in Japanese?</h2>
          <p>
            Yes! You can switch the site language using the toggle button at the top of the screen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">📩 How can I contact you?</h2>
          <p>
            Please use our <a href="/contact" className="text-blue-500 underline">Contact Us</a> page. We'll respond as soon as possible.
          </p>
        </section>
      </div>
    </main>
  )
}
