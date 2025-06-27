import TopArticleList from '../components/TopArticleList'
import articles from '../data/all-articles.json'

export default function Page() {
  return <TopArticleList articles={articles} />
}
