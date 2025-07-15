# BestTech Reviews - Affiliate Marketing Site

A static, SEO-optimized affiliate content site built with Next.js 15, targeting long-tail keywords to drive organic traffic and earn passive income from affiliate links.

## 🚀 Features

- **SEO-Optimized**: Dynamic metadata, OpenGraph tags, JSON-LD structured data
- **Affiliate Tracking**: Click tracking with localStorage and Google Analytics integration
- **Content Management**: MDX-based articles with frontmatter metadata
- **Product Components**: ProductBox and ComparisonTable components for affiliate links
- **Internal Linking**: Automated internal linking engine for SEO
- **Analytics Dashboard**: Track affiliate performance and conversions
- **Content Generation**: GPT-powered content generation script
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 📦 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Content**: MDX with gray-matter for frontmatter
- **Analytics**: Google Analytics 4
- **Deployment**: Vercel
- **Node.js**: 20.x or higher

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-affiliate-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   NEXT_PUBLIC_AMAZON_AFFILIATE_TAG=your-amazon-tag
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   OPENAI_API_KEY=sk-your-openai-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📝 Content Management

### Adding New Articles

1. Create a new `.mdx` file in the `content/` directory
2. Add frontmatter with required fields:
   ```markdown
   ---
   title: "Product Comparison Title"
   description: "SEO-optimized description"
   slug: "product-comparison-slug"
   date: "2025-01-15"
   category: "power-stations"
   tags: ["product1", "product2", "comparison"]
   keywords: "target keyword, related keywords"
   author: "BestTech Reviews Team"
   affiliate_disclosure: true
   featured_image: "/images/featured.jpg"
   ---
   ```

### Using Product Components

**ProductBox Component:**
```jsx
<ProductBox
  name="Jackery Explorer 300"
  price="$299.99"
  originalPrice="$349.99"
  image="/images/jackery-300.jpg"
  features={[
    "293Wh battery capacity",
    "2x USB-A ports",
    "Silent operation"
  ]}
  affiliateUrl="https://amazon.com/dp/B083KBKJ8Q?tag=yourtag"
  rating={4}
  reviewCount={1250}
  badge="Best Seller"
  category="power-stations"
/>
```

**ComparisonTable Component:**
```jsx
<ComparisonTable
  products={[
    {
      name: "Product 1",
      price: "$299.99",
      affiliateUrl: "https://amazon.com/...",
      features: { capacity: "293Wh", weight: "7.1 lbs" }
    }
  ]}
  features={[
    { key: "capacity", label: "Battery Capacity", type: "text" },
    { key: "weight", label: "Weight", type: "text" }
  ]}
/>
```

## 🤖 Content Generation

Generate articles using the GPT-powered script:

```bash
# Generate content for all keywords
npm run generate-content

# Generate limited number of articles
npm run generate-content:limit 5

# Generate for specific category
node scripts/generate-content.js --category power-stations --limit 3
```

### Keyword Research Setup

1. Add keywords to `data/keywords.csv`:
   ```csv
   keyword,search_volume,difficulty,category,intent,products
   "best power station 2025",2400,45,power-stations,commercial,"Jackery 300;Goal Zero Yeti"
   ```

2. Run content generation:
   ```bash
   npm run generate-content
   ```

## 📊 Analytics & Tracking

### Google Analytics Setup

1. Add your GA4 Measurement ID to `.env.local`
2. The GoogleAnalytics component will automatically track:
   - Page views
   - Affiliate clicks
   - Content interactions
   - Conversion events

### Affiliate Click Tracking

All ProductBox and ComparisonTable components automatically track clicks to localStorage and Google Analytics.

View analytics dashboard at: `/dashboard` (component included)

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Generate content
npm run generate-content
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

### Environment Variables for Production

Required environment variables:
- `NEXT_PUBLIC_BASE_URL`: Your domain URL
- `NEXT_PUBLIC_AMAZON_AFFILIATE_TAG`: Amazon affiliate tag
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Google Analytics ID
- `OPENAI_API_KEY`: OpenAI API key for content generation

## 📁 Project Structure

```
my-affiliate-site/
├── app/                    # Next.js App Router pages
│   ├── [slug]/            # Dynamic post pages
│   ├── category/          # Category pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ProductBox.tsx     # Product showcase component
│   ├── ComparisonTable.tsx # Product comparison table
│   ├── Navigation.tsx     # Site navigation
│   └── Footer.tsx         # Site footer
├── content/               # MDX articles
├── lib/                   # Utility functions
│   ├── posts.tsx          # Post management
│   ├── keywords.ts        # Keyword research
│   ├── affiliate-tracking.ts # Click tracking
│   └── internal-linking.ts # SEO linking
├── scripts/               # Content generation scripts
├── templates/             # Content templates
└── data/                  # CSV data files
```

## 🎯 SEO Features

- **Dynamic Metadata**: Title, description, OG tags for each page
- **Structured Data**: JSON-LD for articles and products
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: Search engine directives
- **Internal Linking**: Automated related article suggestions
- **Canonical URLs**: Prevent duplicate content issues

## 📈 Monetization

### Affiliate Programs

- **Amazon Associates**: Primary affiliate program
- **Direct Merchant Programs**: Additional revenue streams
- **Commission Tracking**: Built-in click and conversion tracking

### Revenue Optimization

- **Strategic Link Placement**: ProductBox and ComparisonTable components
- **Content Marketing**: SEO-optimized articles targeting buyer intent
- **Analytics Tracking**: Monitor performance and optimize

## 🔒 Security

- **HTTPS**: Enforced SSL/TLS
- **Content Security Policy**: XSS protection
- **Rate Limiting**: API protection
- **Input Validation**: Form security

## 📞 Support

For questions or issues:
- Check the documentation in `/docs`
- Review the component examples in `/templates`
- Contact: technical@besttech-reviews.com

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ for affiliate marketers**