import Image from 'next/image';
import Link from 'next/link';
import heroImage from './assets/top-img1.webp';
import { getLatestQuizzes, getFallbackQuizzes } from '@/lib/quiz';

// Mock data for testimonials and stats
const testimonials = [
  {
    name: "Sarah M.",
    role: "English Teacher",
    content: "SABACAN has transformed how my students engage with English. The real YouTube content makes learning authentic and fun!",
    rating: 5
  },
  {
    name: "Hiroshi T.",
    role: "Business Professional",
    content: "I improved my TOEIC score by 150 points in 3 months using SABACAN. The vocabulary system is incredibly effective.",
    rating: 5
  },
  {
    name: "Maria L.",
    role: "University Student",
    content: "Finally, an English learning platform that doesn't feel like studying. I actually look forward to my daily quiz!",
    rating: 5
  }
];

const features = [
  {
    icon: "🎧",
    title: "Real YouTube Content",
    description: "Learn from authentic English videos covering science, culture, news, and more. No scripted content—just real conversations."
  },
  {
    icon: "🧠",
    title: "AI-Powered Quizzes",
    description: "Smart quizzes that adapt to your level. Get instant feedback and explanations to accelerate your learning."
  },
  {
    icon: "📚",
    title: "Smart Vocabulary System",
    description: "Build your vocabulary with spaced repetition. Words from quizzes automatically become part of your personal study deck."
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    description: "See your improvement over time with detailed analytics. Track your scores, favorite words, and learning streaks."
  },
  {
    icon: "🎯",
    title: "Personalized Learning",
    description: "Choose your level and interests. Our system recommends content that matches your goals and preferences."
  },
  {
    icon: "📱",
    title: "Learn Anywhere",
    description: "Fully responsive design works perfectly on any device. Study during your commute, lunch break, or anywhere you have 5 minutes."
  }
];

const stats = [
  { number: "100+", label: "Video Quizzes" },
  { number: "800+", label: "Vocabulary Words" },
  { number: "95%", label: "User Satisfaction" },
  { number: "24/7", label: "Available Learning" }
];

export default function HomePage() {
  let latestQuizzes;
  try {
    latestQuizzes = getLatestQuizzes(6);
    if (latestQuizzes.length === 0) {
      latestQuizzes = getFallbackQuizzes(6);
    }
  } catch (error) {
    latestQuizzes = getFallbackQuizzes(6);
  }

  return (
    <main className="text-black dark:text-white bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={heroImage} 
            alt="Learn English with SABACAN" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Master English with
            <span className="block text-blue-400">Real YouTube Videos</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Transform your English skills through authentic content, AI-powered quizzes, and smart vocabulary building. Join thousands learning the fun way.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/top">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
                Start Learning Free ➜
              </button>
            </Link>
            <Link href="/how-to-use">
              <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200">
                How It Works
              </button>
            </Link>
          </div>
          
          <div className="flex justify-center items-center gap-8 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Instant Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose SABACAN?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We've reimagined English learning to be engaging, effective, and accessible. Here's what makes us different.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Learn in 4 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Our proven method makes English learning natural and enjoyable
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Video",
                description: "Pick from 100+ authentic YouTube videos across different topics and difficulty levels"
              },
              {
                step: "02", 
                title: "Watch & Learn",
                description: "Enjoy real English content with subtitles and context that matches your interests"
              },
              {
                step: "03",
                title: "Take the Quiz",
                description: "Test your understanding with AI-generated questions and get instant feedback"
              },
              {
                step: "04",
                title: "Build Vocabulary",
                description: "Review key words with spaced repetition to build lasting vocabulary knowledge"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Quizzes Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              🆕 Latest Quizzes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Fresh content added regularly to keep your learning exciting
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {latestQuizzes.map((quiz, index) => (
              <Link
                key={quiz.slug}
                href={`/article/${quiz.slug}`}
                className="group block bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative aspect-video">
                  <Image
                    src={quiz.thumbnail || `/img/img-${quiz.slug}.webp`}
                    alt={quiz.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {quiz.channel}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      Start Quiz ➜
                    </span>
                    <span className="text-xs text-gray-400">
                      {quiz.publishedAt ? new Date(quiz.publishedAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/top">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all duration-200">
                Explore All Quizzes
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our Learners Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands who've transformed their English with SABACAN
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your English?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners who are already improving their English with SABACAN. Start your journey today—it's completely free!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/signup">
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
                Get Started Free
              </button>
            </Link>
            <Link href="/top">
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200">
                Try a Quiz Now
              </button>
            </Link>
          </div>
          
          <p className="text-sm opacity-75">
            No credit card required • Start learning in under 30 seconds
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-8">
            {[
              {
                question: "Is SABACAN really free?",
                answer: "Yes! SABACAN is completely free to use. You can access all quizzes, vocabulary features, and progress tracking without any payment."
              },
              {
                question: "What English levels does SABACAN support?",
                answer: "We offer content for beginner, intermediate, and advanced learners. Our system helps you find the right level and gradually progress."
              },
              {
                question: "How often is new content added?",
                answer: "We add new video quizzes regularly, typically several times per week. You'll always have fresh content to keep your learning engaging."
              },
              {
                question: "Can I use SABACAN on my phone?",
                answer: "Absolutely! SABACAN is fully responsive and works perfectly on smartphones, tablets, and computers. Learn anywhere, anytime."
              },
              {
                question: "Do I need to create an account?",
                answer: "You can try quizzes without an account, but creating one (free) lets you track progress, save favorite words, and access personalized features."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-8">
                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/faq">
              <button className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                View All FAQs ➜
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}