'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function SiteHeader() {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log('[SiteHeader]', { user, loading }); // ✅ ここに移動！

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/signup');
  };

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <Link href="/" className="text-xl font-bold text-blue-600">
        Mochi English
      </Link>

      {!loading && (
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span>Hello, {user.displayName || user.email}</span>
              <Link href="/account">Account</Link>
              <button onClick={handleSignOut}>Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link href="/signup">Sign up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
