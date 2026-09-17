import { query } from "../config/db.js";

const formatUser = (row, includePassword = false) => {
  if (!row) return null;
  const user = {
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    passwordChangedAt: row.password_changed_at,
    resetPasswordToken: row.reset_password_token,
    resetPasswordExpires: row.reset_password_expires,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
  if (includePassword) {
    user.password = row.password;
  }
  return user;
};

export const User = {
  async findByEmail(email, includePassword = false) {
    const res = await query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1;`,
      [email.trim().toLowerCase()]
    );
    return formatUser(res.rows[0], includePassword);
  },

  async findById(id, includePassword = false) {
    const res = await query(`SELECT * FROM users WHERE id = $1 LIMIT 1;`, [id]);
    return formatUser(res.rows[0], includePassword);
  },

  async findByResetToken(token) {
    const res = await query(
      `SELECT * FROM users 
       WHERE reset_password_token = $1 
         AND reset_password_expires > NOW() 
       LIMIT 1;`,
      [token]
    );
    return formatUser(res.rows[0]);
  },

  async create({ name, email, password }) {
    const res = await query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, LOWER($2), $3)
       RETURNING *;`,
      [name.trim(), email.trim().toLowerCase(), password]
    );
    return formatUser(res.rows[0]);
  },

  async findAll() {
    const res = await query(
      `SELECT id, name, email, created_at, updated_at 
       FROM users 
       ORDER BY created_at DESC;`
    );
    return res.rows.map((row) => formatUser(row));
  },

  async update(id, updates) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(updates.name);
    }
    if (updates.email !== undefined) {
      fields.push(`email = LOWER($${idx++})`);
      values.push(updates.email.trim().toLowerCase());
    }
    if (updates.password !== undefined) {
      fields.push(`password = $${idx++}`);
      values.push(updates.password);
    }
    if (updates.passwordChangedAt !== undefined) {
      fields.push(`password_changed_at = $${idx++}`);
      values.push(updates.passwordChangedAt);
    }
    if (updates.resetPasswordToken !== undefined) {
      fields.push(`reset_password_token = $${idx++}`);
      values.push(updates.resetPasswordToken);
    }
    if (updates.resetPasswordExpires !== undefined) {
      fields.push(`reset_password_expires = $${idx++}`);
      values.push(updates.resetPasswordExpires);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const res = await query(
      `UPDATE users 
       SET ${fields.join(", ")}
       WHERE id = $${idx}
       RETURNING *;`,
      values
    );

    return formatUser(res.rows[0]);
  },

  async deleteById(id) {
    const res = await query(`DELETE FROM users WHERE id = $1 RETURNING *;`, [
      id,
    ]);
    return formatUser(res.rows[0]);
  },
};

export default User;
