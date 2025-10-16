import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'apb_system',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const connectDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    
    // Initialize tables
    await initTables();
    
    client.release();
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

const initTables = async () => {
  const client = await pool.connect();
  
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        agency_id UUID NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'officer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Agencies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS agencies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        jurisdiction VARCHAR(255) NOT NULL,
        location GEOGRAPHY(POINT),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Bulletins table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bulletins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        subject VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        priority VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
        location GEOGRAPHY(POINT),
        address TEXT,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        suspect_info JSONB
      )
    `);

    // Bulletin agencies junction table (many-to-many)
    await client.query(`
      CREATE TABLE IF NOT EXISTS bulletin_agencies (
        bulletin_id UUID REFERENCES bulletins(id) ON DELETE CASCADE,
        agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
        PRIMARY KEY (bulletin_id, agency_id)
      )
    `);

    // Media attachments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_attachments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        bulletin_id UUID REFERENCES bulletins(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_size INTEGER,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables initialized');
  } finally {
    client.release();
  }
};