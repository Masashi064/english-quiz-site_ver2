// app/contact/page.tsx

export const metadata = {
  title: 'Contact Us | SABACAN',
  description: 'Get in touch with the SABACAN team for questions, feedback, or support.',
}

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">📩 Contact Us</h1>

      <p className="mb-4">
        If you have any questions, feedback, or suggestions, feel free to reach out!
      </p>

      <p className="mb-4">
        You can contact us at: <a href="mailto:contact.sabacan365@gmail.com" className="text-blue-500 underline">contact.sabacan365@gmail.com</a>
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        We’ll try to get back to you within 2–3 business days.
      </p>
    </main>
  )
}
