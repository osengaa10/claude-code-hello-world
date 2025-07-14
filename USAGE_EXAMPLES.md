# Usage Examples

## Using ProductBox Component

```tsx
import { ProductBox } from '@/components';

<ProductBox
  name="Jackery Explorer 300"
  price="$299.99"
  originalPrice="$349.99"
  image="/images/jackery-300.jpg"
  features={[
    "293Wh battery capacity",
    "2x USB-A ports",
    "1x USB-C port",
    "Weight: 7.1 lbs",
    "Silent operation"
  ]}
  affiliateUrl="https://www.amazon.com/dp/B083KBKJ8Q?tag=yourtag"
  rating={4}
  reviewCount={1250}
  badge="Best Seller"
  source="jackery-comparison"
/>
```

## Using ComparisonTable Component

```tsx
import { ComparisonTable } from '@/components';

<ComparisonTable
  products={[
    {
      name: "Jackery Explorer 300",
      price: "$299.99",
      originalPrice: "$349.99",
      image: "/images/jackery-300.jpg",
      affiliateUrl: "https://www.amazon.com/dp/B083KBKJ8Q?tag=yourtag",
      rating: 4,
      badge: "Best Value",
      features: {
        capacity: "293Wh",
        weight: "7.1 lbs",
        usbPorts: 2,
        usbcPorts: 1,
        acOutlets: 1,
        warranty: "24 months",
        silent: true
      }
    },
    {
      name: "Jackery Explorer 500",
      price: "$499.99",
      image: "/images/jackery-500.jpg",
      affiliateUrl: "https://www.amazon.com/dp/B07SM5HBK1?tag=yourtag",
      rating: 5,
      badge: "Editor's Choice",
      features: {
        capacity: "518Wh",
        weight: "13.3 lbs",
        usbPorts: 3,
        usbcPorts: 1,
        acOutlets: 1,
        warranty: "24 months",
        silent: true
      }
    }
  ]}
  features={[
    { key: "capacity", label: "Battery Capacity", type: "text" },
    { key: "weight", label: "Weight", type: "text" },
    { key: "usbPorts", label: "USB-A Ports", type: "number" },
    { key: "usbcPorts", label: "USB-C Ports", type: "number" },
    { key: "acOutlets", label: "AC Outlets", type: "number" },
    { key: "warranty", label: "Warranty", type: "text" },
    { key: "silent", label: "Silent Operation", type: "boolean" }
  ]}
  source="jackery-comparison"
/>
```

## Environment Variables

Add these to your `.env.local`:

```
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_AMAZON_AFFILIATE_TAG=your-amazon-tag
```

## Affiliate Link Tracking

The system automatically tracks:
- Click timestamps
- Product names
- Traffic sources
- Conversion paths

Data is stored in localStorage and can be synced to analytics platforms.

## SEO Features

Every article automatically gets:
- Dynamic meta tags
- OpenGraph tags
- Twitter cards
- JSON-LD structured data
- Canonical URLs
- Sitemap generation

## Performance

- Components are client-side only where needed
- Affiliate links are tracked without blocking page load
- Images are optimized for mobile
- Tables are responsive with horizontal scrolling