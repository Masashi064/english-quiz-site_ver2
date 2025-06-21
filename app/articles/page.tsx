import fs from 'fs';
import path from 'path';
import ArticleList from '@/components/ArticleList';

export default function ArticlesPage() {
  const categoryDir = path.join(process.cwd(), 'public/data/category');
  const files = fs.readdirSync(categoryDir);

  const slugs = files
    .filter((name) => name.startsWith('category-') && name.endsWith('.json'))
    .map((name) => name.replace('category-', '').replace('.json', ''));

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Articles</h1>
      <ArticleList slugs={slugs} />
    </main>
  );
}
