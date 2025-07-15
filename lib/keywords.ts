import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  category: string;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  products: string[];
  competition: 'low' | 'medium' | 'high';
  cpc?: number;
  trend?: 'rising' | 'stable' | 'declining';
  seasonality?: boolean;
  lastUpdated: Date;
}

export interface KeywordAnalysis {
  totalKeywords: number;
  categoriesCovered: string[];
  averageSearchVolume: number;
  averageDifficulty: number;
  opportunityScore: number;
  topKeywords: KeywordData[];
  lowCompetitionKeywords: KeywordData[];
}

const KEYWORDS_CSV_PATH = path.join(process.cwd(), 'data', 'keywords.csv');
const KEYWORDS_CACHE_PATH = path.join(process.cwd(), 'data', 'keywords-cache.json');

// Load keywords from CSV file
export async function loadKeywordsFromCSV(): Promise<KeywordData[]> {
  return new Promise((resolve, reject) => {
    const keywords: KeywordData[] = [];
    
    if (!fs.existsSync(KEYWORDS_CSV_PATH)) {
      console.warn('Keywords CSV not found. Creating sample file...');
      createSampleKeywordFile();
    }
    
    fs.createReadStream(KEYWORDS_CSV_PATH)
      .pipe(csv())
      .on('data', (row) => {
        try {
          const keywordData: KeywordData = {
            keyword: row.keyword,
            searchVolume: parseInt(row.search_volume) || 0,
            difficulty: parseInt(row.difficulty) || 0,
            category: row.category || 'uncategorized',
            intent: row.intent as KeywordData['intent'] || 'informational',
            products: row.products ? row.products.split(';').map((p: string) => p.trim()) : [],
            competition: row.competition as KeywordData['competition'] || 'medium',
            cpc: row.cpc ? parseFloat(row.cpc) : undefined,
            trend: row.trend as KeywordData['trend'] || 'stable',
            seasonality: row.seasonality === 'true',
            lastUpdated: new Date(row.last_updated || Date.now())
          };
          keywords.push(keywordData);
        } catch (error) {
          console.warn('Error parsing keyword row:', row, error);
        }
      })
      .on('end', () => {
        // Cache the parsed data
        cacheKeywords(keywords);
        resolve(keywords);
      })
      .on('error', reject);
  });
}

// Create sample keyword file
function createSampleKeywordFile(): void {
  const sampleData = `keyword,search_volume,difficulty,category,intent,products,competition,cpc,trend,seasonality,last_updated
"best portable power station 2025",2400,45,power-stations,commercial,"Jackery Explorer 300;Jackery Explorer 500;Goal Zero Yeti 400",medium,2.50,rising,false,2025-01-15
"jackery 300 vs 500 comparison",890,35,power-stations,commercial,"Jackery Explorer 300;Jackery Explorer 500",low,1.80,stable,false,2025-01-15
"portable solar generator reviews",1200,40,power-stations,informational,"EcoFlow River 2;Bluetti AC200MAX;Goal Zero Yeti 1000",medium,2.20,rising,false,2025-01-15
"best budget power bank 2025",3200,50,power-banks,commercial,"Anker PowerCore 10000;RAVPower 20000;Aukey 10000mAh",high,1.90,stable,false,2025-01-15
"power station for camping",1800,42,power-stations,commercial,"Jackery Explorer 500;Goal Zero Yeti 400;EcoFlow River 2",medium,2.10,rising,true,2025-01-15
"solar power bank review",950,30,power-banks,informational,"Anker PowerCore Solar;RAVPower Solar;Goal Zero Nomad",low,1.60,stable,true,2025-01-15
"best laptop power bank",2100,38,power-banks,commercial,"Anker PowerCore+ 26800;RAVPower 20000;Omni 20+",medium,2.00,stable,false,2025-01-15
"portable generator vs power station",760,25,power-stations,informational,"Honda EU2200i;Jackery Explorer 1000;Goal Zero Yeti 1500X",low,1.70,rising,false,2025-01-15`;
  
  const dataDir = path.dirname(KEYWORDS_CSV_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(KEYWORDS_CSV_PATH, sampleData);
  console.log('Sample keywords.csv created at:', KEYWORDS_CSV_PATH);
}

// Cache keywords to JSON for faster access
function cacheKeywords(keywords: KeywordData[]): void {
  const cacheDir = path.dirname(KEYWORDS_CACHE_PATH);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  
  fs.writeFileSync(KEYWORDS_CACHE_PATH, JSON.stringify(keywords, null, 2));
}

// Load cached keywords
export function loadCachedKeywords(): KeywordData[] | null {
  try {
    if (fs.existsSync(KEYWORDS_CACHE_PATH)) {
      const cached = JSON.parse(fs.readFileSync(KEYWORDS_CACHE_PATH, 'utf-8'));
      return cached.map((k: any) => ({
        ...k,
        lastUpdated: new Date(k.lastUpdated)
      }));
    }
  } catch (error) {
    console.warn('Error loading cached keywords:', error);
  }
  return null;
}

// Get keywords with caching
export async function getKeywords(forceRefresh = false): Promise<KeywordData[]> {
  if (!forceRefresh) {
    const cached = loadCachedKeywords();
    if (cached) return cached;
  }
  
  return await loadKeywordsFromCSV();
}

// Analyze keyword opportunities
export async function analyzeKeywords(): Promise<KeywordAnalysis> {
  const keywords = await getKeywords();
  
  const totalKeywords = keywords.length;
  const categoriesCovered = [...new Set(keywords.map(k => k.category))];
  const averageSearchVolume = keywords.reduce((sum, k) => sum + k.searchVolume, 0) / totalKeywords;
  const averageDifficulty = keywords.reduce((sum, k) => sum + k.difficulty, 0) / totalKeywords;
  
  // Calculate opportunity score (high volume, low difficulty)
  const opportunityScore = keywords.reduce((sum, k) => {
    const score = k.searchVolume / (k.difficulty + 1);
    return sum + score;
  }, 0) / totalKeywords;
  
  // Get top keywords by opportunity score
  const topKeywords = keywords
    .sort((a, b) => (b.searchVolume / (b.difficulty + 1)) - (a.searchVolume / (a.difficulty + 1)))
    .slice(0, 10);
  
  // Get low competition keywords
  const lowCompetitionKeywords = keywords
    .filter(k => k.competition === 'low' && k.difficulty < 40)
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, 10);
  
  return {
    totalKeywords,
    categoriesCovered,
    averageSearchVolume,
    averageDifficulty,
    opportunityScore,
    topKeywords,
    lowCompetitionKeywords
  };
}

// Get keywords by category
export async function getKeywordsByCategory(category: string): Promise<KeywordData[]> {
  const keywords = await getKeywords();
  return keywords.filter(k => k.category === category);
}

// Get keywords by intent
export async function getKeywordsByIntent(intent: KeywordData['intent']): Promise<KeywordData[]> {
  const keywords = await getKeywords();
  return keywords.filter(k => k.intent === intent);
}

// Find content gaps (keywords without existing content)
export async function findContentGaps(): Promise<KeywordData[]> {
  const keywords = await getKeywords();
  // This would check against existing content files
  // For now, return all keywords as potential gaps
  return keywords.filter(k => k.competition === 'low' && k.searchVolume > 500);
}

// Export keywords to different formats
export async function exportKeywords(format: 'csv' | 'json' = 'csv'): Promise<string> {
  const keywords = await getKeywords();
  
  if (format === 'json') {
    return JSON.stringify(keywords, null, 2);
  }
  
  // CSV format
  const headers = [
    'keyword', 'search_volume', 'difficulty', 'category', 'intent',
    'products', 'competition', 'cpc', 'trend', 'seasonality', 'last_updated'
  ];
  
  const csvRows = keywords.map(k => [
    k.keyword,
    k.searchVolume,
    k.difficulty,
    k.category,
    k.intent,
    k.products.join(';'),
    k.competition,
    k.cpc || '',
    k.trend,
    k.seasonality,
    k.lastUpdated.toISOString()
  ]);
  
  return [headers, ...csvRows].map(row => row.join(',')).join('\n');
}