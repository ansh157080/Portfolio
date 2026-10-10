const { initializeDatabase } = require('../config/db');

async function run() {
  console.log('🚀 Running database setup script...');
  const result = await initializeDatabase();
  if (result.connected) {
    console.log('🎉 Database setup completed successfully!');
    process.exit(0);
  } else {
    console.error('❌ Database setup could not connect to MySQL.');
    console.error('   Error detail:', result.error);
    process.exit(1);
  }
}

run();
