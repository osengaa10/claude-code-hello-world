import { getPostBySlug } from "../../lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Metadata } from "next";
import Link from "next/link";
import ProductBox from "@/components/ProductBox";
import { ComparisonTable } from "@/components/ComparisonTable";
import AmazonButton from "@/components/AmazonButton";
import ProductLink from "@/components/ProductLink";
import OptimizedImage from "@/components/OptimizedImage";
import FAQSchema from "@/components/FAQSchema";
import Breadcrumb from "@/components/Breadcrumb";
import ProductReviewSchema from "@/components/ProductReviewSchema";

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
  
  // Generate breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Reviews', href: '/' },
    ...(data.category ? [{ name: data.category.charAt(0).toUpperCase() + data.category.slice(1), href: `/category/${data.category}` }] : []),
    { name: data.title, href: `/${slug}` }
  ];
  
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

  const mdxComponents = {
    ProductBox,
    ComparisonTable,
    AmazonButton,
    ProductLink,
    OptimizedImage,
    FAQSchema,
    ProductReviewSchema,
    img: (props: any) => (
      <OptimizedImage
        src={props.src}
        alt={props.alt || 'Product image'}
        width={props.width || 800}
        height={props.height || 400}
        className="mx-auto"
        {...props}
      />
    ),
    // Add custom styling for common elements
    h1: (props: any) => <h1 className="text-4xl font-bold text-white mb-6 leading-tight" {...props} />,
    h2: (props: any) => <h2 className="text-3xl font-semibold text-white mt-12 mb-6 pb-2 border-b border-primary-600" {...props} />,
    h3: (props: any) => <h3 className="text-2xl font-semibold text-white mt-8 mb-4" {...props} />,
    p: (props: any) => <p className="text-gray-200 leading-relaxed mb-6" {...props} />,
    a: (props: any) => <a className="text-accent-400 hover:text-accent-300 underline transition-colors" {...props} />,
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-accent-400 bg-primary-800 pl-6 py-4 my-6 italic text-gray-200" {...props} />
    ),
    ul: (props: any) => <ul className="space-y-2 mb-6 text-gray-200" {...props} />,
    ol: (props: any) => <ol className="space-y-2 mb-6 text-gray-200 list-decimal list-inside" {...props} />,
    li: (props: any) => <li className="leading-relaxed" {...props} />,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <header className="mb-12">
          <Breadcrumb items={breadcrumbItems} />
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6 leading-tight">
            {data.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-primary-600 mb-8">
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(data.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            {data.author && (
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                By {data.author}
              </div>
            )}
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {Math.ceil(content.split(' ').length / 200)} min read
            </div>
          </div>

          {data.affiliate_disclosure && (
            <div className="bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200 rounded-xl p-6 mb-8">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-warning-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold text-warning-800 mb-1">Affiliate Disclosure</h3>
                  <p className="text-warning-700 leading-relaxed">
                    This post contains affiliate links. If you purchase through these links, we may earn a commission at no extra cost to you. This helps support our content creation efforts.
                  </p>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <MDXRemote source={content} components={mdxComponents} />
        </div>

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-primary-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-primary-600">
              <p>Last updated: {new Date(data.updated || data.date).toLocaleDateString()}</p>
            </div>
            <Link 
              href="/" 
              className="inline-flex items-center text-accent-600 hover:text-accent-700 font-medium transition-colors"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              More Reviews
            </Link>
          </div>
        </footer>
      </article>
    </>
  );
}
