import { pool } from "../index.js";
import { resetAllTables } from "../helpers.js";

try {
  const insertedRows = await resetAllTables([
    { task: "Walk the dog", completion_date: "1999-01-08" },
    { task: "Feed the computer", completion_date: "2015-01-10" },
  ]);
  console.log("Reset all tables and inserted data");
  console.log(insertedRows);
} catch (err) {
  console.error(err);
} finally {
  await pool.end();
}
