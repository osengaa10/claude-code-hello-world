const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDir = path.join(__dirname, '../content');

// Function to optimize meta description
function optimizeDescription(title, products) {
  const year = '2025';
  const baseDescription = `Compare ${products.slice(0, 2).join(', ')} & more. Expert reviews of the best ${title.toLowerCase().replace(' 2025', '')} in ${year}.`;
  
  // If still too long, make it even shorter
  if (baseDescription.length > 155) {
    return `Best ${title.toLowerCase().replace(' 2025', '')} ${year}. Compare top products with expert reviews & buying guides.`;
  }
  
  return baseDescription;
}

// Read all MDX files
const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.mdx'));

files.forEach(file => {
  const filePath = path.join(contentDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, content: markdownContent } = matter(content);
  
  // Check if description is too long
  if (data.description && data.description.length > 155) {
    console.log(`Fixing: ${file} - Length: ${data.description.length}`);
    
    // Extract product names from tags or title
    const products = data.tags || [];
    const title = data.title;
    
    // Generate optimized description
    data.description = optimizeDescription(title, products);
    
    console.log(`New description (${data.description.length} chars): ${data.description}`);
    
    // Write back the file
    const newContent = matter.stringify(markdownContent, data);
    fs.writeFileSync(filePath, newContent);
  }
});

console.log('Meta description optimization complete!');