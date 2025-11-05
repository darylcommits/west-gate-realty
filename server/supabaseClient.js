require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials in .env file!');
  console.error('Please add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false
    }
  }
);

// Test connection
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('carousel_properties')
      .select('count');

    if (error) throw error;
    console.log('✅ Successfully connected to Supabase!');
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:', error.message);
  }
}

testConnection();

module.exports = supabase;
