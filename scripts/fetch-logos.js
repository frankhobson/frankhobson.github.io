import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to get clean domain
const getDomain = (urlStr) => {
  try {
    if (!urlStr) return null;
    const url = new URL(urlStr);
    return url.hostname.replace(/^www\./, '');
  } catch (e) {
    return null;
  }
};

const run = async () => {
  const expPath = path.join(__dirname, '../src/data/experiences.json');
  const volPath = path.join(__dirname, '../src/data/volunteering.json');
  const logosDir = path.join(__dirname, '../public/images/logos');

  // Create directory if it doesn't exist
  if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true });
  }

  const domains = new Set();

  // Helper to load and parse links from JSON files
  const addLinksFromFile = (filePath) => {
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (item.link) {
              const dom = getDomain(item.link);
              if (dom) domains.add(dom);
            }
          });
        }
      } catch (e) {
        console.error(`Error parsing ${filePath}:`, e);
      }
    }
  };

  addLinksFromFile(expPath);
  addLinksFromFile(volPath);

  console.log(`Found ${domains.size} unique domains to check.`);

  for (const domain of domains) {
    const targetPath = path.join(logosDir, `${domain}.png`);
    if (fs.existsSync(targetPath)) {
      // Already exists locally
      continue;
    }

    console.log(`Downloading logo for ${domain}...`);
    try {
      const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
      const res = await fetch(faviconUrl);
      if (!res.ok) {
        console.warn(`Failed to fetch logo for ${domain}: ${res.statusText}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(targetPath, buffer);
      console.log(`Saved logo for ${domain} successfully.`);
      // Delay slightly
      await new Promise(r => setTimeout(r, 100));
    } catch (err) {
      console.error(`Error downloading logo for ${domain}:`, err);
    }
  }

  // Scan public/images/travel/ and generate travelImages.json
  const travelImagesDir = path.join(__dirname, '../public/images/travel');
  const travelImagesJsonPath = path.join(__dirname, '../src/data/travelImages.json');

  if (fs.existsSync(travelImagesDir)) {
    const files = fs.readdirSync(travelImagesDir)
      .filter(file => file !== '.gitkeep' && file !== '.DS_Store' && fs.statSync(path.join(travelImagesDir, file)).isFile());
    
    // Ensure default.png is in the list, and put it first
    if (!files.includes('default.png')) {
      files.unshift('default.png');
    } else {
      const idx = files.indexOf('default.png');
      files.splice(idx, 1);
      files.unshift('default.png');
    }

    fs.writeFileSync(travelImagesJsonPath, JSON.stringify(files, null, 2));
    console.log(`Updated travel images list: ${files.length} images found.`);
  }

  console.log('Logo fetching and travel images scanning complete.');
};

run().catch(err => {
  console.error('Fatal error in fetch-logos script:', err);
  process.exit(1);
});
