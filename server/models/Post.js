import { query } from "../config/db.js";

const formatPost = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    content: row.content,
    image: row.image || "default-post-image.jpg",
    category: row.category || "Other",
    author: row.author_name
      ? {
          _id: row.author_id,
          id: row.author_id,
          name: row.author_name,
          email: row.author_email,
        }
      : row.author_id,
    authorId: row.author_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const Post = {
  async create({ title, content, category, author, image }) {
    const res = await query(
      `INSERT INTO posts (title, content, category, author_id, image)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *;`,
      [
        title.trim(),
        content,
        category || "Other",
        author,
        image || "default-post-image.jpg",
      ]
    );

    return this.findById(res.rows[0].id);
  },

  async findAll() {
    const res = await query(
      `SELECT p.*, u.name AS author_name, u.email AS author_email
       FROM posts p
       JOIN users u ON p.author_id = u.id
       ORDER BY p.created_at DESC;`
    );
    return res.rows.map((row) => formatPost(row));
  },

  async findById(id) {
    const res = await query(
      `SELECT p.*, u.name AS author_name, u.email AS author_email
       FROM posts p
       JOIN users u ON p.author_id = u.id
       WHERE p.id = $1
       LIMIT 1;`,
      [id]
    );
    return formatPost(res.rows[0]);
  },

  async update(id, updates) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (updates.title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(updates.title);
    }
    if (updates.content !== undefined) {
      fields.push(`content = $${idx++}`);
      values.push(updates.content);
    }
    if (updates.category !== undefined) {
      fields.push(`category = $${idx++}`);
      values.push(updates.category);
    }
    if (updates.image !== undefined) {
      fields.push(`image = $${idx++}`);
      values.push(updates.image);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    await query(
      `UPDATE posts 
       SET ${fields.join(", ")}
       WHERE id = $${idx};`,
      values
    );

    return this.findById(id);
  },

  async deleteById(id) {
    const res = await query(`DELETE FROM posts WHERE id = $1 RETURNING *;`, [
      id,
    ]);
    return formatPost(res.rows[0]);
  },
};

export default Post;
