import { getPostBySlug } from "../../lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = getPostBySlug(slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";
  
  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords || data.title.split(" ").join(", "),
    authors: [{ name: data.author || "Admin" }],
    openGraph: {
      title: data.title,
      description: data.description,
      type: "article",
      url: `${baseUrl}/${slug}`,
      images: data.featured_image ? [{ url: data.featured_image }] : [],
      publishedTime: data.date,
      modifiedTime: data.updated || data.date,
      tags: data.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: data.featured_image ? [data.featured_image] : [],
    },
    alternates: {
      canonical: `${baseUrl}/${slug}`,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const { content, data } = getPostBySlug(slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.description,
    author: {
      "@type": "Person",
      name: data.author || "Admin",
    },
    publisher: {
      "@type": "Organization",
      name: "Your Site Name",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: data.date,
    dateModified: data.updated || data.date,
    url: `${baseUrl}/${slug}`,
    image: data.featured_image ? [data.featured_image] : [],
    keywords: data.keywords || data.tags?.join(", "),
    articleSection: data.category,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="prose mx-auto p-4">
        <h1>{data.title}</h1>
        {data.affiliate_disclosure && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm">
              <strong>Affiliate Disclosure:</strong> This post contains affiliate links. 
              If you purchase through these links, we may earn a commission at no extra cost to you.
            </p>
          </div>
        )}
        <MDXRemote source={content} />
      </main>
    </>
  );
}
