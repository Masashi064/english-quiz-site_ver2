export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">About the Creator</h1>
      <p className="mb-4">
        Hi, I'm <strong>Petori</strong>, the creator of <strong>SABACAN</strong>.
      </p>
      <p className="mb-4">
        I'm currently based in <strong>Singapore</strong> and work on this site in my spare time.
        I speak both <strong>Japanese</strong> and <strong>English</strong>, and I'm passionate about
        language learning, AI technology, blogging, and travel.
      </p>
      <p>
        SABACAN was born from my desire to make English learning more fun, consistent, and accessible—
        especially through real-world content like YouTube videos.
      </p>
      <h2 className="text-2xl font-semibold mt-10 mb-2">Why I built SABACAN</h2>
      <p className="mb-4">
        As a Japanese person living in Singapore, I often switch between English and Japanese in daily life. While there are many resources for learning English, I felt there was a lack of tools that combine real-life content with structured learning.
      </p>
      <p className="mb-4">
        I created SABACAN to bridge that gap — a site where learners can enjoy content like YouTube videos while reinforcing their skills through quizzes and vocabulary cards. The goal is to make English learning more engaging, consistent, and personalized.
      </p>
      <h2 className="text-2xl font-semibold mt-10 mb-2">Technology Stack</h2>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Next.js</strong> – for building the modern frontend with App Router</li>
        <li><strong>Tailwind CSS</strong> – for responsive and maintainable styling</li>
        <li><strong>Firebase</strong> – for user authentication and Firestore database</li>
        <li><strong>Python</strong> – for backend scripts to automate quiz and vocabulary generation</li>
        <li><strong>OpenAI API</strong> – to generate quiz content based on YouTube transcripts</li>
        <li><strong>Google Sheets API</strong> – to manage video metadata and content workflow</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-10 mb-2">Follow Me</h2>
      <p>
        I occasionally post about English learning, blogging, and indie development on X (formerly Twitter).  
        You can follow me here:{" "}
        <a
          href="https://x.com/kamonohashisg"
          className="underline text-blue-500 hover:text-blue-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          @kamonohashisg
        </a>
      </p>

    </main>
  );
}
