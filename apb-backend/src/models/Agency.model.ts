import { pool } from './database';
import { Agency } from '../types';

export class AgencyModel {
  static async create(agencyData: Omit<Agency, 'id' | 'createdAt'>): Promise<Agency> {
    const result = await pool.query(`
      INSERT INTO agencies (name, jurisdiction, location)
      VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326))
      RETURNING *
    `, [
      agencyData.name,
      agencyData.jurisdiction,
      agencyData.location.lng,
      agencyData.location.lat
    ]);

    const agency = result.rows[0];
    
    return {
      id: agency.id,
      name: agency.name,
      jurisdiction: agency.jurisdiction,
      location: {
        lat: agencyData.location.lat,
        lng: agencyData.location.lng
      },
      createdAt: new Date(agency.created_at)
    };
  }

  static async findById(id: string): Promise<Agency | null> {
    const result = await pool.query(`
      SELECT 
        *,
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat
      FROM agencies 
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) return null;

    const agency = result.rows[0];
    return this.mapRowToAgency(agency);
  }

  static async findAll(): Promise<Agency[]> {
    const result = await pool.query(`
      SELECT 
        *,
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat
      FROM agencies 
      ORDER BY name
    `);

    return result.rows.map(row => this.mapRowToAgency(row));
  }

  static async update(id: string, updates: Partial<Agency>): Promise<Agency | null> {
    const setClause = [];
    const values = [];
    let paramCount = 1;

    if (updates.name) {
      setClause.push(`name = $${paramCount}`);
      values.push(updates.name);
      paramCount++;
    }

    if (updates.jurisdiction) {
      setClause.push(`jurisdiction = $${paramCount}`);
      values.push(updates.jurisdiction);
      paramCount++;
    }

    if (updates.location) {
      setClause.push(`location = ST_SetSRID(ST_MakePoint($${paramCount}, $${paramCount + 1}), 4326)`);
      values.push(updates.location.lng, updates.location.lat);
      paramCount += 2;
    }

    if (setClause.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    
    await pool.query(`
      UPDATE agencies 
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
    `, values);

    return this.findById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await pool.query(`
      DELETE FROM agencies 
      WHERE id = $1
      RETURNING id
    `, [id]);

    return result.rows.length > 0;
  }

  private static mapRowToAgency(row: any): Agency {
    return {
      id: row.id,
      name: row.name,
      jurisdiction: row.jurisdiction,
      location: {
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng)
      },
      createdAt: new Date(row.created_at)
    };
  }
}