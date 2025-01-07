const { Pool } = require("pg");


const pool = new Pool({
  user: "development",
  password: "development",
  host: "localhost",
  database: "bootcampx",
});

// Get cohort name and limit from command line
const cohortName = process.argv[2];
const limit = process.argv[3] || 5;

// Validate input
if (!cohortName || isNaN(limit)) {
  console.log("Usage: node students.js <COHORT_NAME> <LIMIT>");
  process.exit(1);
}

// SQL query using parameterized query placeholders
const queryString = `
  SELECT students.id AS student_id, students.name AS name, cohorts.name AS cohort
  FROM students
  JOIN cohorts ON cohorts.id = cohort_id
  WHERE cohorts.name LIKE $1
  LIMIT $2;
`;

// Values to replace placeholders ($1 and $2)
const values = [`%${cohortName}%`, limit];


pool
  .query(queryString, values)
  .then((res) => {
    res.rows.forEach((user) => {
      console.log(
        `${user.name} has an id of ${user.student_id} and was in the ${user.cohort} cohort`
      );
    });
  })
  .catch((err) => {
    console.error("Query error:", err.stack);
  })
  .finally(() => {
    pool.end(); 
  });
