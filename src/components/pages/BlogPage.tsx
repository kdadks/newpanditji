import { useKV } from '@github/spark/hooks'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { BookOpen, CaretRight } from '@phosphor-icons/react'
import { blogArticles as defaultBlogs } from '../../lib/data'

interface BlogArticle {
  id: string
  title: string
  excerpt: string
  category: string
  content?: string
}

export default function BlogPage() {
  const [adminBlogs] = useKV<BlogArticle[]>('admin-blogs', defaultBlogs)
  const blogArticles = adminBlogs || defaultBlogs
  return (
    <div className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <BookOpen className="mx-auto mb-6 text-primary" size={64} />
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Spiritual Wisdom Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights on Hindu philosophy, spirituality, and practical guidance for modern living
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {blogArticles.map(article => (
            <Card key={article.id} className="hover:shadow-lg transition-all hover:border-primary/30">
              <CardContent className="p-8">
                <div className="mb-3">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
                <h2 className="font-heading font-semibold text-2xl mb-3">{article.title}</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">{article.excerpt}</p>
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  Read More
                  <CaretRight className="ml-2" size={16} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 p-8 bg-muted/30 rounded-lg max-w-2xl mx-auto">
          <h3 className="font-heading font-semibold text-xl mb-2">More Articles Coming Soon</h3>
          <p className="text-muted-foreground">
            We regularly publish new articles on Hindu spirituality, philosophy, and practices. Check back often for fresh insights and wisdom.
          </p>
        </div>
      </div>
    </div>
  )
}
