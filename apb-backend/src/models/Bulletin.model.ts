import { pool } from './database';
import { Bulletin, MediaAttachment } from '../types';

export class BulletinModel {
  static async create(bulletinData: Omit<Bulletin, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bulletin> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Insert bulletin
      const bulletinResult = await client.query(`
        INSERT INTO bulletins (
          subject, description, type, priority, status, location, address, 
          created_by, suspect_info
        ) VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326), $8, $9, $10)
        RETURNING *
      `, [
        bulletinData.subject,
        bulletinData.description,
        bulletinData.type,
        bulletinData.priority,
        bulletinData.status,
        bulletinData.location.lng,
        bulletinData.location.lat,
        bulletinData.location.address,
        bulletinData.createdBy,
        bulletinData.suspectInfo ? JSON.stringify(bulletinData.suspectInfo) : null
      ]);

      const bulletin = bulletinResult.rows[0];

      // Insert agency associations
      if (bulletinData.agencies.length > 0) {
        const agencyValues = bulletinData.agencies.map((agencyId: any) => 
          `('${bulletin.id}', '${agencyId}')`
        ).join(',');
        
        await client.query(`
          INSERT INTO bulletin_agencies (bulletin_id, agency_id) 
          VALUES ${agencyValues}
        `);
      }

      await client.query('COMMIT');

      return {
        ...bulletin,
        location: {
          lat: bulletinData.location.lat,
          lng: bulletinData.location.lng,
          address: bulletinData.location.address
        },
        agencies: bulletinData.agencies,
        suspectInfo: bulletinData.suspectInfo,
        media: bulletinData.media,
        createdAt: new Date(bulletin.created_at),
        updatedAt: new Date(bulletin.updated_at)
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findById(id: string): Promise<Bulletin | null> {
    const result = await pool.query(`
      SELECT 
        b.*,
        ST_X(b.location::geometry) as lng,
        ST_Y(b.location::geometry) as lat,
        array_agg(ba.agency_id) as agency_ids,
        u.name as created_by_name
      FROM bulletins b
      LEFT JOIN bulletin_agencies ba ON b.id = ba.bulletin_id
      LEFT JOIN users u ON b.created_by = u.id
      WHERE b.id = $1
      GROUP BY b.id, u.name
    `, [id]);

    if (result.rows.length === 0) return null;

    return this.mapRowToBulletin(result.rows[0]);
  }

  static async findByAgency(agencyId: string): Promise<Bulletin[]> {
    const result = await pool.query(`
      SELECT 
        b.*,
        ST_X(b.location::geometry) as lng,
        ST_Y(b.location::geometry) as lat,
        array_agg(ba.agency_id) as agency_ids,
        u.name as created_by_name
      FROM bulletins b
      INNER JOIN bulletin_agencies ba ON b.id = ba.bulletin_id
      LEFT JOIN users u ON b.created_by = u.id
      WHERE ba.agency_id = $1 AND b.status = 'ACTIVE'
      GROUP BY b.id, u.name
      ORDER BY b.created_at DESC
    `, [agencyId]);

    return result.rows.map((row: any) => this.mapRowToBulletin(row));
  }

  static async findNearby(lat: number, lng: number, radiusKm: number = 50): Promise<Bulletin[]> {
    const result = await pool.query(`
      SELECT 
        b.*,
        ST_X(b.location::geometry) as lng,
        ST_Y(b.location::geometry) as lat,
        array_agg(ba.agency_id) as agency_ids,
        u.name as created_by_name,
        ST_Distance(b.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)) as distance
      FROM bulletins b
      LEFT JOIN bulletin_agencies ba ON b.id = ba.bulletin_id
      LEFT JOIN users u ON b.created_by = u.id
      WHERE b.status = 'ACTIVE'
        AND ST_DWithin(b.location, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3 * 1000)
      GROUP BY b.id, u.name
      ORDER BY distance ASC
      LIMIT 100
    `, [lng, lat, radiusKm]);

    return result.rows.map((row: any) => this.mapRowToBulletin(row));
  }

  static async update(id: string, updates: Partial<Bulletin>): Promise<Bulletin | null> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update bulletin fields
      const setClause = [];
      const values = [];
      let paramCount = 1;

      if (updates.subject) {
        setClause.push(`subject = $${paramCount}`);
        values.push(updates.subject);
        paramCount++;
      }

      if (updates.description) {
        setClause.push(`description = $${paramCount}`);
        values.push(updates.description);
        paramCount++;
      }

      if (updates.status) {
        setClause.push(`status = $${paramCount}`);
        values.push(updates.status);
        paramCount++;
      }

      if (updates.location) {
        setClause.push(`location = ST_SetSRID(ST_MakePoint($${paramCount}, $${paramCount + 1}), 4326)`);
        values.push(updates.location.lng, updates.location.lat);
        paramCount += 2;

        if (updates.location.address) {
          setClause.push(`address = $${paramCount}`);
          values.push(updates.location.address);
          paramCount++;
        }
      }

      setClause.push(`updated_at = CURRENT_TIMESTAMP`);

      if (setClause.length > 0) {
        values.push(id);
        await client.query(`
          UPDATE bulletins 
          SET ${setClause.join(', ')}
          WHERE id = $${paramCount}
        `, values);
      }

      // Update agencies if provided
      if (updates.agencies) {
        await client.query('DELETE FROM bulletin_agencies WHERE bulletin_id = $1', [id]);
        
        if (updates.agencies.length > 0) {
          const agencyValues = updates.agencies.map((agencyId: any) => 
            `('${id}', '${agencyId}')`
          ).join(',');
          
          await client.query(`
            INSERT INTO bulletin_agencies (bulletin_id, agency_id) 
            VALUES ${agencyValues}
          `);
        }
      }

      await client.query('COMMIT');

      // Return updated bulletin
      return await this.findById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private static mapRowToBulletin(row: any): Bulletin {
    return {
      id: row.id,
      subject: row.subject,
      description: row.description,
      type: row.type,
      priority: row.priority,
      status: row.status,
      location: {
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng),
        address: row.address
      },
      agencies: row.agency_ids.filter((id: string | null) => id !== null),
      createdBy: row.created_by,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      suspectInfo: row.suspect_info ? JSON.parse(row.suspect_info) : undefined,
      media: [] // Will be populated separately
    };
  }
}