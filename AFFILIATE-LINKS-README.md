# Affiliate Links Management System

This system streamlines the process of managing Amazon affiliate links across your site using a CSV-based approach.

## Quick Start

1. **Check current status:**
   ```bash
   npm run affiliate:stats
   ```

2. **Find products missing ASINs:**
   ```bash
   npm run affiliate:audit
   ```

3. **Validate existing ASINs:**
   ```bash
   npm run affiliate:validate
   ```

4. **Generate comprehensive report:**
   ```bash
   npm run affiliate:report
   ```

## How It Works

### 1. CSV Database (`affiliate-products.csv`)

All affiliate products are managed in a single CSV file with these columns:
- `product_name` - Exact match for AmazonButton productName prop
- `affiliate_url` - Full Amazon affiliate link with linkId (or ASIN for legacy)
- `status` - verified, pending, or inactive
- `article_slug` - Which article uses this product
- `category` - Product category for organization
- `last_updated` - When URL was last verified
- `notes` - Any special notes

### 2. Automatic Loading

The system automatically loads affiliate URLs from the CSV file at build time:
- Server-side: CSV is parsed and loaded into `PRODUCT_URLS`
- Client-side: Falls back to basic hardcoded URLs/ASINs
- Build process: Next.js static generation includes all URLs

### 3. AmazonButton Component

Use in your MDX articles:
```jsx
<AmazonButton productName="Sony WF-C500" />
```
or with explicit URL:
```jsx
<AmazonButton productName="Sony WF-C500" affiliateUrl="https://amazon.com/dp/B094C4VDJZ?tag=yourTag&linkId=xyz" />
```

- If `affiliateUrl` prop is provided, it uses that directly
- If no `affiliateUrl` prop, it looks up the product name in the CSV database
- Falls back to Amazon search if no URL found
- Still supports legacy `asin` prop for backward compatibility

## Workflow for Adding New Affiliate URLs

### Step 1: Audit Your Content
```bash
npm run affiliate:audit
```

This scans all MDX files and generates:
- `affiliate-reports/priority-asins-YYYY-MM-DD.txt` - Products ranked by usage frequency
- `affiliate-reports/missing-products-YYYY-MM-DD.csv` - Template for adding new products

### Step 2: Generate Affiliate Links

For each product in the priority list:

1. **Find the product on Amazon:**
   - Search for the exact product name
   - Navigate to the correct product page

2. **Generate affiliate link:**
   - Use Amazon's affiliate link generator (SiteStripe or Associates dashboard)
   - Copy the complete URL including linkId parameter
   - Example: `https://amazon.com/dp/B094C4VDJZ?th=1&linkCode=sl1&tag=yourTag&linkId=xyz`

3. **Update `affiliate-products.csv`:**
   - Replace `pending` with the full affiliate URL
   - Change status from `pending` to `verified`
   - Update `last_updated` to current date

### Step 3: Validate Changes
```bash
npm run affiliate:validate
```

This checks:
- ASIN format validation (B + 9 alphanumeric characters)
- Lists remaining pending products
- Generates collection worksheets for missing ASINs

### Step 4: Deploy
```bash
npm run build
vercel --prod
```

## CSV Management Examples

### Adding a New Product
```csv
"Logitech MX Master 3S",B09HM94VDS,verified,wireless-mouse-large-hands,peripherals,2025-01-24,"Premium productivity mouse"
```

### Marking Product as Pending
```csv
"New Product Name",pending,pending,article-slug,category,2025-01-24,"Need to find ASIN"
```

### Deactivating a Product
```csv
"Old Product",B123456789,inactive,old-article,category,2025-01-24,"Product discontinued"
```

## File Structure

```
affiliate-products.csv              # Main database
lib/csv-loader.ts                   # CSV parsing utilities
lib/amazon.ts                       # Amazon link generation
scripts/audit-affiliate-products.js # Find missing ASINs
scripts/validate-asins.js           # Validate ASIN formats
scripts/affiliate-manager.js        # Unified management script
affiliate-reports/                  # Generated reports
```

## Available Scripts

- `npm run affiliate:stats` - Quick overview of affiliate products
- `npm run affiliate:audit` - Scan articles for missing ASINs
- `npm run affiliate:validate` - Validate ASIN formats and show pending
- `npm run affiliate:report` - Run both audit and validation

## Tips for Efficient ASIN Collection

1. **Use the priority list** - Start with products used multiple times
2. **Work by category** - Collect all mouse ASINs at once, then keyboards, etc.
3. **Verify product variants** - Ensure you're getting the right color/size/model
4. **Check availability** - Some products may be discontinued
5. **Update in batches** - Collect 10-15 ASINs, then update the CSV and validate

## Troubleshooting

### "Product not found in CSV"
The audit script found a product that's not in your CSV. Add it using the missing products template.

### "Invalid ASIN format"
ASINs must be exactly 10 characters: B followed by 9 alphanumeric characters.

### "Build fails with CSV error"
Check that your CSV file is properly formatted and all quoted values are correctly escaped.

### "Links don't work"
Verify that:
1. The ASIN exists in `affiliate-products.csv`
2. The `productName` in your MDX exactly matches the CSV
3. You've rebuilt and deployed after CSV changes

## Performance Notes

- CSV loading happens only at build time, not on every request
- Client-side fallback ensures the site works even if CSV fails to load
- All affiliate links include the `unbiasedtechr-20` affiliate tag
- Links open in new tabs with proper `rel` attributes for SEO

## Security Considerations

- CSV file is committed to git for version control
- No sensitive data in CSV (ASINs are public)
- All external links include `noopener,noreferrer` for security
- Affiliate tags are consistently applied to prevent revenue loss