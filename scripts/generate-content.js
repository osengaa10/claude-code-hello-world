#!/usr/bin/env node

/**
 * GPT-Powered Content Generation Script
 * 
 * This script generates affiliate marketing articles using OpenAI's GPT API
 * based on keyword research data and product comparisons.
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const OpenAI = require('openai');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CONTENT_DIR = path.join(__dirname, '../content');
const KEYWORDS_CSV = path.join(__dirname, '../data/expanded-keywords.csv');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Ensure directories exist
function ensureDirectories() {
  [CONTENT_DIR, path.join(__dirname, '../data')].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Load keyword data from CSV
async function loadKeywords() {
  return new Promise((resolve, reject) => {
    const keywords = [];
    
    if (!fs.existsSync(KEYWORDS_CSV)) {
      console.warn('Keywords CSV not found. Creating sample file...');
      createSampleKeywordFile();
    }
    
    fs.createReadStream(KEYWORDS_CSV)
      .pipe(csv())
      .on('data', (row) => {
        keywords.push({
          keyword: row.keyword,
          searchVolume: parseInt(row.search_volume),
          difficulty: parseInt(row.difficulty),
          category: row.category,
          intent: row.intent,
          products: row.products ? row.products.split(';') : []
        });
      })
      .on('end', () => {
        resolve(keywords);
      })
      .on('error', reject);
  });
}

// Create sample keyword file
function createSampleKeywordFile() {
  const sampleData = `keyword,search_volume,difficulty,category,intent,products
"best portable power station 2025",2400,45,power-stations,commercial,"Jackery Explorer 300;Jackery Explorer 500;Goal Zero Yeti 400"
"jackery 300 vs 500 comparison",890,35,power-stations,commercial,"Jackery Explorer 300;Jackery Explorer 500"
"portable solar generator reviews",1200,40,power-stations,informational,"EcoFlow River 2;Bluetti AC200MAX;Goal Zero Yeti 1000"
"best budget power bank 2025",3200,50,power-banks,commercial,"Anker PowerCore 10000;RAVPower 20000;Aukey 10000mAh"
"power station for camping",1800,42,power-stations,commercial,"Jackery Explorer 500;Goal Zero Yeti 400;EcoFlow River 2"`;
  
  fs.writeFileSync(KEYWORDS_CSV, sampleData);
  console.log('Sample keywords.csv created at:', KEYWORDS_CSV);
}

// Generate article content using GPT
async function generateArticle(keyword, products, category) {
  const systemPrompt = `You are an expert affiliate marketing content writer who creates SEO-optimized product comparison articles. 
  
  Write a comprehensive, unbiased article comparing the given products for the target keyword. 
  
  Requirements:
  - Write in a helpful, authoritative tone
  - Include pros and cons for each product
  - Add specific technical details and real-world use cases
  - Include relevant headings (H2, H3) for SEO
  - Mention price ranges and value propositions
  - Include a clear recommendation section
  - Write 1500-2000 words
  - Include calls-to-action for affiliate links
  - Use natural keyword placement
  - Include FAQ section
  
  The article should help readers make informed purchase decisions.`;
  
  const userPrompt = `Write a comprehensive product comparison article for the keyword: "${keyword}"
  
  Products to compare: ${products.join(', ')}
  Category: ${category}
  
  Structure the article with:
  1. Introduction with keyword focus
  2. Product comparison table
  3. Detailed reviews of each product
  4. Use cases and recommendations
  5. FAQ section
  6. Conclusion with clear recommendation
  
  Include specific technical specifications, pricing information, and real-world usage scenarios.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

// Create MDX file with frontmatter
function createMDXFile(keyword, content, category, products) {
  const slug = keyword.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  
  const title = keyword.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  const description = `Compare the best ${products.slice(0, 3).join(', ')} and more. Find the perfect ${category.replace('-', ' ')} with our detailed reviews and recommendations.`;
  
  const frontmatter = `---
title: "${title}"
description: "${description}"
slug: "${slug}"
date: "${new Date().toISOString().split('T')[0]}"
category: "${category}"
tags: [${products.map(p => `"${p}"`).join(', ')}]
keywords: "${keyword}, ${products.join(', ')}"
author: "BestTech Reviews Team"
affiliate_disclosure: true
featured_image: "/images/${slug}-featured.jpg"
---

`;

  const fullContent = frontmatter + content;
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  
  fs.writeFileSync(filePath, fullContent);
  console.log(`Created article: ${filePath}`);
  
  return filePath;
}

// Main function
async function main() {
  try {
    ensureDirectories();
    
    if (!OPENAI_API_KEY) {
      console.error('Error: OPENAI_API_KEY environment variable is required');
      process.exit(1);
    }
    
    console.log('Loading keywords...');
    const keywords = await loadKeywords();
    
    console.log(`Found ${keywords.length} keywords to process`);
    
    // Get command line arguments
    const args = process.argv.slice(2);
    const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : 5;
    const category = args.includes('--category') ? args[args.indexOf('--category') + 1] : null;
    
    // Filter keywords
    let filteredKeywords = keywords;
    if (category) {
      filteredKeywords = keywords.filter(k => k.category === category);
    }
    
    // Sort by search volume and difficulty
    filteredKeywords.sort((a, b) => {
      // Prioritize high volume, low difficulty
      const scoreA = a.searchVolume / (a.difficulty + 1);
      const scoreB = b.searchVolume / (b.difficulty + 1);
      return scoreB - scoreA;
    });
    
    const keywordsToProcess = filteredKeywords.slice(0, limit);
    
    console.log(`Processing ${keywordsToProcess.length} keywords...`);
    
    for (const keywordData of keywordsToProcess) {
      // Check if file already exists
      const slug = keywordData.keyword.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
      
      if (fs.existsSync(filePath)) {
        console.log(`⏭ Skipping existing article: ${keywordData.keyword}`);
        continue;
      }
      
      console.log(`Generating article for: ${keywordData.keyword}`);
      
      try {
        const content = await generateArticle(
          keywordData.keyword,
          keywordData.products,
          keywordData.category
        );
        
        const createdFilePath = createMDXFile(
          keywordData.keyword,
          content,
          keywordData.category,
          keywordData.products
        );
        
        console.log(`✓ Generated: ${path.basename(createdFilePath)}`);
        
        // Add delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`✗ Failed to generate article for "${keywordData.keyword}":`, error.message);
      }
    }
    
    console.log('Content generation complete!');
    
  } catch (error) {
    console.error('Script error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateArticle, createMDXFile, loadKeywords };