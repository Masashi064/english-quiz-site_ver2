import Link from 'next/link'

export default function SiteHeader({ user }: { user?: { name: string } }) {
  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 text-black dark:text-white">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-300 hover:underline">
          Mochi English
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* ダークモードトグル（将来） */}
        {/* <ThemeToggle /> */}

        {user ? (
          <div className="text-sm">
            👋 Hello, {user.name}
            <Link href="/account" className="ml-4 underline text-blue-600 dark:text-blue-300">
              Account
            </Link>
          </div>
        ) : (
          <>
            <Link href="/login" className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              Log in
            </Link>
            <Link href="/signup" className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
