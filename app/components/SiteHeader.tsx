'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useEffect, useState } from 'react'


export default function SiteHeader() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const fetchNickname = async () => {
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        setNickname(data.nickname || '');
      }
    };

    fetchNickname();
  }, [user]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/signup');
  };

  return (
    <header className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
      <Link href="/" className="flex items-center">
        <Image
          src="/img/logo-dark.png"
          alt="SABACAN"
          width={140}
          height={60}
          className="h-8 w-auto object-contain cursor-pointer dark:block hidden"
          priority
        />
        <Image
          src="/img/logo-light.png"
          alt="SABACAN"
          width={140}
          height={60}
          className="h-8 w-auto object-contain cursor-pointer dark:hidden block"
          priority
        />
      </Link>

      {!loading && (
        <div className="flex gap-4 items-center text-sm">
          {user ? (
            <>
              <p>Hi, {nickname || 'user'}</p>
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
