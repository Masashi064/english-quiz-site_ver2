'use client';
import Link from 'next/link';

type Props = {
  slug: string;
  title: string;
  description?: string;
  thumbnail?: string;
  channel?: string;
  publishedAt?: string;
};

export default function QuizCard({
  slug,
  title,
  description,
  thumbnail,
  channel,
  publishedAt,
}: Props) {
  return (
    <div className="border rounded shadow p-4 hover:shadow-lg transition bg-white dark:bg-gray-800">
      {thumbnail && (
        <img
          src={thumbnail}
          alt={`${title} thumbnail`}
          className="w-full h-48 object-cover rounded mb-3"
        />
      )}

      <h3 className="text-lg font-semibold">{title}</h3>

      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 my-2">
          {description}
        </p>
      )}

      {channel && (
        <p className="text-xs text-gray-500 dark:text-gray-400">📺 {channel}</p>
      )}

      {publishedAt && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          📅 {new Date(publishedAt).toLocaleDateString()}
        </p>
      )}

      <Link href={`/article/${slug}`}>
        <button className="btn-primary w-full mt-2">クイズへ ➜</button>
      </Link>
    </div>
  );
}
