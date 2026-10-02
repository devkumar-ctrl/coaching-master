import { readFile, writeFile, readdir, stat } from 'fs/promises';
import path from 'path';

async function getAllTsFiles(dir, files = []) {
  const items = await readdir(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = await stat(fullPath);
    
    if (stats.isDirectory()) {
      await getAllTsFiles(fullPath, files);
    } else if (item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function updateFile(filePath) {
  try {
    console.log(`Processing: ${path.relative(process.cwd(), filePath)}`);
    let content = await readFile(filePath, 'utf8');
    let originalContent = content;
    
    // Skip files that already use getDatabase correctly
    if (content.includes('import { getDatabase }') && !content.includes('clientPromise') && !content.includes('coaching')) {
      console.log(`  ✓ Already updated`);
      return;
    }
    
    // Replace import
    if (content.includes("import clientPromise from '@/lib/db'")) {
      content = content.replace(
        "import clientPromise from '@/lib/db'",
        "import { getDatabase } from '@/lib/db'"
      );
    }
    
    // Replace database connections - more specific patterns
    content = content.replace(
      /const client = await clientPromise;\s*\n\s*const db = client\.db\(["']coaching["']\);/g,
      'const db = await getDatabase();'
    );
    
    content = content.replace(
      /const client = await clientPromise;\s*\n\s*const db = client\.db\(["']coaching["']\);/g,
      'const db = await getDatabase();'
    );
    
    // Handle cases where they're on the same line
    content = content.replace(
      /const client = await clientPromise;\s*const db = client\.db\(["']coaching["']\);/g,
      'const db = await getDatabase();'
    );
    
    content = content.replace(
      /const client = await clientPromise;\s*const db = client\.db\(["']coaching["']\);/g,
      'const db = await getDatabase();'
    );
    
    if (content !== originalContent) {
      await writeFile(filePath, content);
      console.log(`  ✅ Updated`);
    } else {
      console.log(`  ✓ No changes needed`);
    }
    
  } catch (error) {
    console.error(`  ❌ Error processing:`, error.message);
  }
}

async function main() {
  console.log('🔄 Updating database imports in API routes...\n');
  
  try {
    const apiDir = path.join(process.cwd(), 'app', 'api');
    const files = await getAllTsFiles(apiDir);
    
    console.log(`Found ${files.length} TypeScript files to process\n`);
    
    for (const file of files) {
      await updateFile(file);
    }
    
    console.log('\n✅ Database import update completed!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main().catch(console.error);
