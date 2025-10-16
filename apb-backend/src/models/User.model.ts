import { pool } from './database';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  agencyId: string;
  role: 'officer' | 'admin' | 'dispatcher';
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel {
  static async create(userData: {
    email: string;
    password: string;
    name: string;
    agencyId: string;
    role?: User['role'];
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const result = await pool.query(`
      INSERT INTO users (email, password_hash, name, agency_id, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      userData.email,
      hashedPassword,
      userData.name,
      userData.agencyId,
      userData.role || 'officer'
    ]);

    const user = result.rows[0];
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      agencyId: user.agency_id,
      role: user.role,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at)
    };
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(`
      SELECT * FROM users WHERE email = $1
    `, [email]);

    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      agencyId: user.agency_id,
      role: user.role,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at)
    };
  }

  static async validatePassword(user: User, password: string): Promise<boolean> {
    const result = await pool.query(`
      SELECT password_hash FROM users WHERE id = $1
    `, [user.id]);

    if (result.rows.length === 0) return false;

    return await bcrypt.compare(password, result.rows[0].password_hash);
  }

  static async findById(id: string): Promise<User | null> {
    const result = await pool.query(`
      SELECT * FROM users WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      agencyId: user.agency_id,
      role: user.role,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at)
    };
  }
}