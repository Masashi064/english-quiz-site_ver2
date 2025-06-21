import fs from 'fs';
import path from 'path';

type Quiz = {
  slug: string;
  title: string;
  description?: string;
  thumbnail?: string;
  channel?: string;
  publishedAt?: string;
};

export function getLatestQuizzes(count: number): Quiz[] {
  const categoryDir = path.join(process.cwd(), 'public/data/category');
  const files = fs.readdirSync(categoryDir)
    .filter((name) => name.startsWith('category-') && name.endsWith('.json'))
    .map((name) => {
      const filePath = path.join(categoryDir, name);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const slug = content.slug;

      return {
        slug,
        title: content.movie_title,
        description: content.introduction,
        thumbnail: `/img/img-${slug}.jpg`, // ローカル画像を使用
        channel: content.channel_name,
        publishedAt: content.published_at,
      };
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return files.slice(0, count);
}
