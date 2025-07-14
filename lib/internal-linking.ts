import { getAllPostMeta } from './posts';
import type { PostMeta } from './posts';

export interface InternalLink {
  url: string;
  title: string;
  description: string;
  relevanceScore: number;
  keywords: string[];
  category: string;
}

export interface LinkingSuggestion {
  sourcePost: string;
  targetPost: string;
  anchorText: string;
  context: string;
  relevanceScore: number;
  linkType: 'related' | 'supporting' | 'comparison' | 'category';
}

// Extract keywords from text
function extractKeywords(text: string): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  // Remove common stop words
  const stopWords = new Set([
    'this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'said',
    'each', 'which', 'their', 'would', 'there', 'could', 'other', 'than', 'very',
    'what', 'know', 'just', 'first', 'about', 'after', 'back', 'also', 'good',
    'well', 'being', 'only', 'come', 'work', 'over', 'should', 'where', 'most',
    'some', 'time', 'such', 'even', 'more', 'like', 'when', 'here', 'into',
    'through', 'during', 'before', 'after', 'same', 'best', 'review', 'reviews'
  ]);
  
  return words.filter(word => !stopWords.has(word));
}

// Calculate relevance score between two posts
function calculateRelevanceScore(post1: PostMeta, post2: PostMeta): number {
  let score = 0;
  
  // Category match (high weight)
  if (post1.category === post2.category) {
    score += 30;
  }
  
  // Extract keywords from title and description
  const keywords1 = extractKeywords(`${post1.title} ${post1.description}`);
  const keywords2 = extractKeywords(`${post2.title} ${post2.description}`);
  
  // Keyword overlap (medium weight)
  const keywordOverlap = keywords1.filter(k => keywords2.includes(k));
  score += keywordOverlap.length * 5;
  
  // Tag overlap (medium weight)
  if (post1.tags && post2.tags) {
    const tagOverlap = post1.tags.filter(tag => post2.tags?.includes(tag));
    score += tagOverlap.length * 10;
  }
  
  // Title similarity (low weight)
  const titleWords1 = post1.title.toLowerCase().split(' ');
  const titleWords2 = post2.title.toLowerCase().split(' ');
  const titleOverlap = titleWords1.filter(word => titleWords2.includes(word));
  score += titleOverlap.length * 3;
  
  // Boost for comparison articles
  if (post1.title.includes('vs') || post2.title.includes('vs')) {
    score += 15;
  }
  
  // Boost for similar product mentions
  const products1 = extractProductNames(post1.title + ' ' + post1.description);
  const products2 = extractProductNames(post2.title + ' ' + post2.description);
  const productOverlap = products1.filter(p => products2.includes(p));
  score += productOverlap.length * 20;
  
  return score;
}

// Extract product names from text
function extractProductNames(text: string): string[] {
  const productPatterns = [
    /\b(jackery|goal zero|ecoflow|bluetti|anker|ravpower|aukey)\s+[\w\s]+\b/gi,
    /\b(explorer|yeti|river|ac\d+|powercore|portable)\s+[\w\d]+\b/gi,
    /\b\w+\s+(power station|power bank|generator|charger)\b/gi,
  ];
  
  const products: string[] = [];
  productPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      products.push(...matches.map(m => m.trim()));
    }
  });
  
  return [...new Set(products)];
}

// Generate internal linking suggestions
export function generateLinkingSuggestions(
  minRelevanceScore: number = 20
): LinkingSuggestion[] {
  const posts = getAllPostMeta();
  const suggestions: LinkingSuggestion[] = [];
  
  for (const sourcePost of posts) {
    const relatedPosts = posts
      .filter(post => post.slug !== sourcePost.slug)
      .map(post => ({
        post,
        score: calculateRelevanceScore(sourcePost, post)
      }))
      .filter(({ score }) => score >= minRelevanceScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Top 5 most relevant
    
    for (const { post: targetPost, score } of relatedPosts) {
      const linkType = determineLinkType(sourcePost, targetPost);
      const anchorText = generateAnchorText(sourcePost, targetPost, linkType);
      
      suggestions.push({
        sourcePost: sourcePost.slug,
        targetPost: targetPost.slug,
        anchorText,
        context: `Link from "${sourcePost.title}" to "${targetPost.title}"`,
        relevanceScore: score,
        linkType
      });
    }
  }
  
  return suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// Determine the type of link between two posts
function determineLinkType(
  sourcePost: PostMeta,
  targetPost: PostMeta
): LinkingSuggestion['linkType'] {
  // Comparison articles
  if (sourcePost.title.includes('vs') || targetPost.title.includes('vs')) {
    return 'comparison';
  }
  
  // Same category
  if (sourcePost.category === targetPost.category) {
    return 'category';
  }
  
  // Related products or topics
  const sourceKeywords = extractKeywords(sourcePost.title);
  const targetKeywords = extractKeywords(targetPost.title);
  const overlap = sourceKeywords.filter(k => targetKeywords.includes(k));
  
  if (overlap.length > 2) {
    return 'related';
  }
  
  return 'supporting';
}

// Generate appropriate anchor text
function generateAnchorText(
  sourcePost: PostMeta,
  targetPost: PostMeta,
  linkType: LinkingSuggestion['linkType']
): string {
  const targetTitle = targetPost.title;
  
  switch (linkType) {
    case 'comparison':
      return `compare with ${targetTitle}`;
    case 'category':
      return `other ${targetPost.category?.replace('-', ' ')} options`;
    case 'related':
      return `learn more about ${targetTitle}`;
    case 'supporting':
    default:
      return targetTitle;
  }
}

// Get related posts for a specific post
export function getRelatedPosts(
  postSlug: string,
  limit: number = 3
): PostMeta[] {
  const posts = getAllPostMeta();
  const currentPost = posts.find(p => p.slug === postSlug);
  
  if (!currentPost) return [];
  
  const relatedPosts = posts
    .filter(post => post.slug !== postSlug)
    .map(post => ({
      post,
      score: calculateRelevanceScore(currentPost, post)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
  
  return relatedPosts;
}

// Get posts by category
export function getPostsByCategory(category: string): PostMeta[] {
  const posts = getAllPostMeta();
  return posts.filter(post => post.category === category);
}

// Get posts with similar tags
export function getPostsByTags(tags: string[], limit: number = 5): PostMeta[] {
  const posts = getAllPostMeta();
  
  return posts
    .filter(post => post.tags && post.tags.some(tag => tags.includes(tag)))
    .sort((a, b) => {
      const aOverlap = a.tags?.filter(tag => tags.includes(tag)).length || 0;
      const bOverlap = b.tags?.filter(tag => tags.includes(tag)).length || 0;
      return bOverlap - aOverlap;
    })
    .slice(0, limit);
}

// Generate breadcrumbs for navigation
export function generateBreadcrumbs(postSlug: string): Array<{ label: string; url: string }> {
  const posts = getAllPostMeta();
  const post = posts.find(p => p.slug === postSlug);
  
  if (!post) return [];
  
  const breadcrumbs = [
    { label: 'Home', url: '/' },
  ];
  
  if (post.category) {
    breadcrumbs.push({
      label: post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      url: `/category/${post.category}`
    });
  }
  
  breadcrumbs.push({
    label: post.title,
    url: `/${post.slug}`
  });
  
  return breadcrumbs;
}

// Auto-generate internal links in content
export function autoGenerateInternalLinks(
  content: string,
  currentPostSlug: string
): string {
  const posts = getAllPostMeta();
  const otherPosts = posts.filter(p => p.slug !== currentPostSlug);
  
  let updatedContent = content;
  
  // Sort posts by title length (longer first to avoid partial matches)
  const sortedPosts = otherPosts.sort((a, b) => b.title.length - a.title.length);
  
  for (const post of sortedPosts) {
    // Create regex to match the post title in content
    const titleRegex = new RegExp(`\\b${post.title}\\b`, 'gi');
    const linkRegex = new RegExp(`<a[^>]*>${post.title}</a>`, 'gi');
    
    // Only add link if title appears and isn't already linked
    if (titleRegex.test(updatedContent) && !linkRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(
        titleRegex,
        `<a href="/${post.slug}" class="text-blue-600 hover:text-blue-800 underline">${post.title}</a>`
      );
      break; // Only add one link per post to avoid over-linking
    }
  }
  
  return updatedContent;
}

// Export linking suggestions as CSV
export function exportLinkingSuggestions(suggestions: LinkingSuggestion[]): string {
  const headers = ['Source Post', 'Target Post', 'Anchor Text', 'Link Type', 'Relevance Score'];
  const rows = suggestions.map(s => [
    s.sourcePost,
    s.targetPost,
    s.anchorText,
    s.linkType,
    s.relevanceScore.toString()
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
}