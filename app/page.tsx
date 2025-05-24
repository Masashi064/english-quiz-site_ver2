import fs from 'fs'
import path from 'path'
import ArticleList from '@/components/ArticleList'

export default function HomePage() {
  const categoryDir = path.join(process.cwd(), 'public/data/category')
  const files = fs.readdirSync(categoryDir)

  const slugs = files
    .filter((name) => name.startsWith('category-') && name.endsWith('.json'))
    .map((name) => name.replace('category-', '').replace('.json', ''))

  return <ArticleList slugs={slugs} />
}
