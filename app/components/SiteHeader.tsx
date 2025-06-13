'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';

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
      {/* 左側：ロゴとナビゲーション */}
      <div className="flex items-center gap-6">
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

        {/* ✅ How to Use リンク追加 */}
        <Link href="/how-to-use" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500">
          How to Use
        </Link>
      </div>

      {/* 右側：ユーザー状態に応じたリンク */}
      {!loading && (
        <div className="flex gap-4 items-center text-sm">
          {user ? (
            <>
              <Link href="/account">Account</Link>
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
