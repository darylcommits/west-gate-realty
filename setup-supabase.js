#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 West Gate Realty - Supabase Setup Helper\n');

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  console.log('📝 Current .env content:');
  console.log('─'.repeat(50));
  console.log(fs.readFileSync(envPath, 'utf8'));
  console.log('─'.repeat(50));
} else {
  console.log('❌ .env file not found');
  console.log('📝 Creating .env file...\n');
  
  const envContent = `# Supabase Configuration
# Replace these with your actual Supabase project URL and anon key
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# Admin Configuration
REACT_APP_ADMIN_EMAIL=admin@westgaterealty.com
REACT_APP_ADMIN_PASSWORD=admin123`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
}

console.log('\n📋 Next Steps:');
console.log('1. Go to https://supabase.com and create a new project');
console.log('2. Get your Project URL and anon key from Settings → API');
console.log('3. Replace the placeholder values in .env file:');
console.log('   - REACT_APP_SUPABASE_URL=https://your-project.supabase.co');
console.log('   - REACT_APP_SUPABASE_ANON_KEY=your-anon-key');
console.log('4. Run the database SQL script in Supabase SQL Editor');
console.log('5. Restart your development server: npm start');
console.log('\n🎉 Your admin panel will then show all the content!');
