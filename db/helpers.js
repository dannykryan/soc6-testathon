import { pool } from "./index.js";

/**
 * @param {{ task: string; completion_date: string }[]} data
 */
export async function resetAllTables(data) {
  // If you're unsure about DROP TABLE, see: https://www.postgresql.org/docs/current/sql-droptable.html
  // If you're unsure about NOT NULL, see: https://www.postgresql.org/docs/current/ddl-constraints.html#id-1.5.4.6.6
  await pool.query(`
    DROP TABLE IF EXISTS todos;
    CREATE TABLE todos (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      task VARCHAR(200) NOT NULL,
      completion_date TIMESTAMPTZ NOT NULL
    );
  `);

  const inserted = await pool.query(
    `INSERT INTO todos (
      task,
      completion_date
    ) (
      SELECT task, completion_date
      FROM json_populate_recordset(NULL::todos, $1::JSON)
    )
    RETURNING *;`,
    [JSON.stringify(data)]
  );

  return inserted.rows;
}
