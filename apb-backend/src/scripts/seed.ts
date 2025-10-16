import { pool } from '../models/database';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('🌱 Seeding database with sample data...');

    // Insert sample agencies (let PostgreSQL generate UUIDs)
    const agenciesResult = await client.query(`
      INSERT INTO agencies (name, jurisdiction, location) VALUES
      ('Springfield Police Department', 'Springfield', ST_SetSRID(ST_MakePoint(-89.644, 39.781), 4326)),
      ('County Sheriff Office', 'Springfield County', ST_SetSRID(ST_MakePoint(-89.650, 39.785), 4326)),
      ('State Police', 'Statewide', ST_SetSRID(ST_MakePoint(-89.650, 39.800), 4326))
      RETURNING id, name
    `);
    console.log('✅ Agencies created:', agenciesResult.rows);

    const springfieldPdId = agenciesResult.rows[0].id;

    // Insert test users
    const hashedPassword = await bcrypt.hash('password123', 12);
    const userResult = await client.query(`
      INSERT INTO users (email, password_hash, name, agency_id, role) VALUES
      ('officer@springfieldpd.gov', $1, 'John Officer', $2, 'officer'),
      ('admin@springfieldpd.gov', $1, 'Admin User', $2, 'admin')
      RETURNING id, email, name, role
    `, [hashedPassword, springfieldPdId]);
    console.log('✅ Users created:', userResult.rows);

    const officerId = userResult.rows[0].id;

    // Insert sample bulletins
    const bulletinsResult = await client.query(`
      INSERT INTO bulletins (subject, description, type, priority, status, location, address, created_by, suspect_info) VALUES
      ('Armed Robbery Suspect - Downtown', 'Male suspect, approximately 25-30 years old, armed with handgun. Last seen fleeing in white sedan.', 'BOLO', 'HIGH', 'ACTIVE', ST_SetSRID(ST_MakePoint(-89.644, 39.781), 4326), '123 Main St, Springfield', $1, $2),
      ('Missing Child - Park Area', '8-year-old female, last seen at Central Park wearing pink dress.', 'MISSING_PERSON', 'URGENT', 'ACTIVE', ST_SetSRID(ST_MakePoint(-89.650, 39.785), 4326), 'Central Park, Springfield', $1, $3)
      RETURNING id, subject, type
    `, [
      officerId,
      JSON.stringify({
        name: "John Doe",
        age: 28,
        height: "5'10",
        weight: "180 lbs",
        hairColor: "Brown",
        clothing: "Blue jeans, black hoodie",
        weapons: ["Handgun"]
      }),
      JSON.stringify({
        name: "Sarah Johnson",
        age: 8,
        height: "4'2",
        weight: "60 lbs",
        hairColor: "Blonde",
        clothing: "Pink dress, white shoes"
      })
    ]);
    console.log('✅ Bulletins created:', bulletinsResult.rows);

    // Get all agency IDs for linking
    const allAgencyIds = agenciesResult.rows.map(row => row.id);
    const allBulletinIds = bulletinsResult.rows.map(row => row.id);

    console.log('🔗 Linking bulletins to agencies...');
    
    // Link all bulletins to all agencies - FIXED: Use separate inserts
    for (const bulletinId of allBulletinIds) {
      for (const agencyId of allAgencyIds) {
        await client.query(`
          INSERT INTO bulletin_agencies (bulletin_id, agency_id) 
          VALUES ($1, $2)
          ON CONFLICT (bulletin_id, agency_id) DO NOTHING
        `, [bulletinId, agencyId]);
      }
    }
    console.log('✅ Bulletin agency associations created');

    await client.query('COMMIT');
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📋 Sample Login Credentials:');
    console.log('   Email: officer@springfieldpd.gov');
    console.log('   Password: password123');
    console.log('   Role: officer');
    console.log('');
    console.log('   Email: admin@springfieldpd.gov');
    console.log('   Password: password123');
    console.log('   Role: admin');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
  } finally {
    client.release();
    process.exit();
  }
}

// Only run if called directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };