import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';

async function updateFile(filePath) {
  try {
    console.log(`Processing: ${filePath}`);
    let content = await readFile(filePath, 'utf8');
    
    // Skip files that already use getDatabase
    if (content.includes('import { getDatabase }')) {
      console.log(`  ✓ Already updated: ${filePath}`);
      return;
    }
    
    // Skip files that don't use clientPromise or coaching
    if (!content.includes('clientPromise') && !content.includes('coaching')) {
      console.log(`  ✓ No changes needed: ${filePath}`);
      return;
    }
    
    let modified = false;
    
    // Replace import
    if (content.includes("import clientPromise from '@/lib/db'")) {
      content = content.replace(
        "import clientPromise from '@/lib/db'",
        "import { getDatabase } from '@/lib/db'"
      );
      modified = true;
    }
    
    // Replace database connections
    content = content.replace(
      /const client = await clientPromise;\s*const db = client\.db\(["']coaching["']\);/g,
      'const db = await getDatabase();'
    );
    
    content = content.replace(
      /const client = await clientPromise;\s*const db = client\.db\(["']coaching["']\);/g,
      'const db = await getDatabase();'
    );
    
    // Handle single line cases
    content = content.replace(
      /const client = await clientPromise;/g,
      '// Removed clientPromise usage'
    );
    
    content = content.replace(
      /const db = client\.db\(["']coaching["']\);/g,
      'const db = await getDatabase();'
    );
    
    content = content.replace(
      /const db = client\.db\(["']coaching["']\);/g,
      'const db = await getDatabase();'
    );
    
    // Clean up duplicate comments
    content = content.replace(/\/\/ Removed clientPromise usage\s*const db = await getDatabase\(\);/g, 'const db = await getDatabase();');
    
    if (modified || content !== await readFile(filePath, 'utf8')) {
      await writeFile(filePath, content);
      console.log(`  ✅ Updated: ${filePath}`);
    } else {
      console.log(`  ✓ No changes made: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
  }
}

async function main() {
  console.log('🔄 Updating database imports in API routes...\n');
  
  // Find all route files
  const files = await glob('app/api/**/*.ts', { 
    ignore: ['**/node_modules/**'],
    cwd: process.cwd()
  });
  
  console.log(`Found ${files.length} files to process\n`);
  
  // Process each file
  for (const file of files) {
    const fullPath = path.resolve(file);
    await updateFile(fullPath);
  }
  
  console.log('\n✅ Database import update completed!');
}

main().catch(console.error);
