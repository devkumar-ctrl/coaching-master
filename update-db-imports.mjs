#!/usr/bin/env node

// Script to update all API routes to use the new database helper
// Run this with: node update-db-imports.mjs

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const API_DIR = './app/api';

async function updateRouteFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Check if file needs updating
    if (!content.includes('clientPromise') || content.includes('getDatabase')) {
      return false;
    }
    
    let updatedContent = content;
    
    // Update imports
    updatedContent = updatedContent.replace(
      /import clientPromise from ['"]@\/lib\/db['"];?/g,
      'import { getDatabase } from \'@/lib/db\';'
    );
    
    // Update database connection pattern
    updatedContent = updatedContent.replace(
      /const client = await clientPromise;\s*const db = client\.db\(['"][^'"]*['"]\);/g,
      'const db = await getDatabase();'
    );
    
    await writeFile(filePath, updatedContent);
    return true;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
    return false;
  }
}

async function findRouteFiles(dir) {
  const files = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...await findRouteFiles(fullPath));
      } else if (entry.name === 'route.ts') {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return files;
}

async function main() {
  console.log('🔍 Finding API route files...');
  
  const routeFiles = await findRouteFiles(API_DIR);
  console.log(`📁 Found ${routeFiles.length} route files`);
  
  let updatedCount = 0;
  
  for (const file of routeFiles) {
    const wasUpdated = await updateRouteFile(file);
    if (wasUpdated) {
      console.log(`✅ Updated: ${file}`);
      updatedCount++;
    } else {
      console.log(`⏭️  Skipped: ${file}`);
    }
  }
  
  console.log(`\n🎉 Updated ${updatedCount} files`);
  console.log('\n📝 Don\'t forget to:');
  console.log('1. Update your MONGODB_URI in .env.local to include the database name');
  console.log('2. Example: mongodb://localhost:27017/coaching');
  console.log('3. Or: mongodb+srv://user:pass@cluster.mongodb.net/coaching');
}

main().catch(console.error);
