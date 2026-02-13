import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'src/blog')

export interface BlogPost {
  slug: string
  title: string
  date: string
  author?: string
  excerpt?: string
  contentHtml?: string
}

export function getSortedPostsData(): BlogPost[] {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md') && fs.statSync(path.join(postsDirectory, fileName)).size > 0)
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)
      
      // Extract first paragraph as excerpt
      const content = matterResult.content
      const firstParagraph = content.split('\n\n').find(p => p.trim() && !p.startsWith('#') && !p.startsWith('---'))
      const excerpt = firstParagraph?.replace(/\*\*/g, '').substring(0, 200) + '...' || ''

      return {
        slug,
        title: matterResult.data.title || slug.replace(/-/g, ' '),
        date: matterResult.data.date || '2025-01-01',
        author: matterResult.data.author || 'EU Jobs Team',
        excerpt,
      }
    })

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) return 1
    return -1
  })
}

export function getAllPostSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter(fileName => fileName.endsWith('.md') && fs.statSync(path.join(postsDirectory, fileName)).size > 0)
    .map(fileName => fileName.replace(/\.md$/, ''))
}

export async function getPostData(slug: string): Promise<BlogPost | null> {
  try {
    const decodedSlug = decodeURIComponent(slug)
    const fullPath = path.join(postsDirectory, `${decodedSlug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
      slug: decodedSlug,
      title: matterResult.data.title || decodedSlug.replace(/-/g, ' '),
      date: matterResult.data.date || '2025-01-01',
      author: matterResult.data.author || 'EU Jobs Team',
      contentHtml,
    }
  } catch (error) {
    console.error('Error reading post:', error)
    return null
  }
}
