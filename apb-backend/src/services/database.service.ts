import { pool } from '../models/database';

export class DatabaseService {
  static async healthCheck(): Promise<boolean> {
    try {
      const result = await pool.query('SELECT 1 as health_check');
      return result.rows[0].health_check === 1;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  static async getDatabaseStats() {
    try {
      const [
        usersCount,
        agenciesCount,
        bulletinsCount,
        activeBulletinsCount
      ] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM users'),
        pool.query('SELECT COUNT(*) FROM agencies'),
        pool.query('SELECT COUNT(*) FROM bulletins'),
        pool.query('SELECT COUNT(*) FROM bulletins WHERE status = $1', ['ACTIVE'])
      ]);

      return {
        users: parseInt(usersCount.rows[0].count),
        agencies: parseInt(agenciesCount.rows[0].count),
        totalBulletins: parseInt(bulletinsCount.rows[0].count),
        activeBulletins: parseInt(activeBulletinsCount.rows[0].count),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get database stats:', error);
      throw error;
    }
  }

  static async cleanupExpiredBulletins() {
    try {
      const result = await pool.query(`
        UPDATE bulletins 
        SET status = 'EXPIRED' 
        WHERE status = 'ACTIVE' 
        AND created_at < NOW() - INTERVAL '30 days'
        RETURNING id
      `);
      
      console.log(`Cleaned up ${result.rows.length} expired bulletins`);
      return result.rows.length;
    } catch (error) {
      console.error('Failed to cleanup expired bulletins:', error);
      throw error;
    }
  }
}