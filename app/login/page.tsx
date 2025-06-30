'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, db, signInWithGoogle } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithGoogle();
      const user = result.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        nickname: user.displayName || '',
        createdAt: serverTimestamp(),
        level: '',
        goal: '',
      }, { merge: true });

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Log in to Your Account
        </h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {!showEmailForm && (
          <>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 font-semibold text-gray-700 dark:text-white shadow-sm mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                <path d="M533.5 278.4c0-17.4-1.5-34.1-4.3-50.4H272v95.3h146.9c-6.4 34.3-25.2 63.4-53.6 82.9v68h86.7c50.7-46.7 81.5-115.4 81.5-195.8z" fill="#4285f4" />
                <path d="M272 544.3c72.6 0 133.5-24.1 178-65.3l-86.7-68c-24.1 16.2-54.8 25.6-91.3 25.6-70.2 0-129.7-47.4-150.9-111.2h-89.2v69.9c44.3 88.2 135.2 149 239.8 149z" fill="#34a853" />
                <path d="M121.1 325.4c-10.4-30.7-10.4-63.9 0-94.6v-69.9h-89.2c-29.3 58.6-29.3 127.1 0 185.7l89.2-69.9z" fill="#fbbc04" />
                <path d="M272 107.7c39.5-.6 77.6 13.9 107 40.5l80.1-80.1C409.4 24.1 348.1-.5 272 0 168.5 0 77.5 60.8 33.2 149l89.2 69.9c21.1-63.8 80.6-111.2 150.9-111.2z" fill="#ea4335" />
              </svg>
              Sign in with Google
            </button>

            <button
              type="button"
              onClick={() => setShowEmailForm(true)}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
            >
              Log in with Email
            </button>
          </>
        )}

        {showEmailForm && (
          <form className="space-y-4 mt-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-200">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
            >
              Log In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
