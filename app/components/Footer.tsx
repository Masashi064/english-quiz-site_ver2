// app/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-800 text-center text-sm text-gray-600 dark:text-gray-300 py-4 mt-10">
      <p>&copy; {new Date().getFullYear()} SABACAN365. All rights reserved.</p>
      <p>
        <a href="/privacy" className="underline hover:text-blue-500">Privacy Policy</a> |{' '}
        <a href="/terms" className="underline hover:text-blue-500">Terms of Use</a>
      </p>
    </footer>
  );
}
