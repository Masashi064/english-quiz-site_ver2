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
  // Check if we're in a server environment
  if (typeof window !== 'undefined') {
    // Client-side fallback
    return [];
  }

  try {
    const categoryDir = path.join(process.cwd(), 'public/data/category');
    
    // Check if directory exists
    if (!fs.existsSync(categoryDir)) {
      return [];
    }
    
    const files = fs.readdirSync(categoryDir)
      .filter((name) => name.startsWith('category-') && name.endsWith('.json'))
      .map((name) => {
        const filePath = path.join(categoryDir, name);
        try {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const slug = content.slug;

          return {
            slug,
            title: content.movie_title,
            description: content.introduction,
            thumbnail: `/img/img-${slug}.webp`,
            channel: content.channel_name,
            publishedAt: content.published_at,
          };
        } catch (error) {
          console.warn(`Error reading file ${filePath}:`, error);
          return null;
        }
      })
      .filter((item): item is Quiz => item !== null)
      .sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      });

    return files.slice(0, count);
  } catch (error) {
    console.warn('Error in getLatestQuizzes:', error);
    return [];
  }
}

// Fallback function for client-side or when files aren't available
export function getFallbackQuizzes(count: number): Quiz[] {
  return [
    {
      slug: "00aba3e3",
      title: "People who can taste words - 6 Minute English",
      description: "Imagine being able to 'taste' every word that you hear.",
      thumbnail: "/img/img-00aba3e3.webp",
      channel: "BBC Learning English",
      publishedAt: "2022-05-26T22:29:35Z",
    }
  ].slice(0, count);
}