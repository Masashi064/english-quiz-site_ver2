'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SiteHeader() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/signup');
  };

  return (
    <header className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
      <Link href="/">
        {/* ダークモード用ロゴ */}
        <Image
          src="/img/logo-dark.png"
          alt="SABACAN"
          width={140}
          height={40}
          className="h-8 w-auto object-contain dark:block hidden"
          priority
        />
        {/* ライトモード用ロゴ */}
        <Image
          src="/img/logo-light.png"
          alt="SABACAN"
          width={140}
          height={40}
          className="h-8 w-auto object-contain dark:hidden block"
          priority
        />
      </Link>

      {!loading && (
        <div className="flex gap-4 items-center text-sm">
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
