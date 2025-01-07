const { Pool } = require('pg');


const pool = new Pool({
  user: 'development',        
  password: 'development',    
  host: 'localhost',          
  database: 'bootcampx'       
});

// Get cohort name from command line
const cohortName = process.argv[2] || 'JUL02';

// Validate input
if (!cohortName) {
  console.log('Usage: node teachers.js <COHORT_NAME>');
  process.exit(1);
}

// SQL query using parameterized query placeholders
const queryString = `
  SELECT DISTINCT teachers.name AS teacher, cohorts.name AS cohort
  FROM teachers
  JOIN assistance_requests ON teacher_id = teachers.id
  JOIN students ON student_id = students.id
  JOIN cohorts ON cohort_id = cohorts.id
  WHERE cohorts.name = $1
  ORDER BY teacher;
`;

// Values to replace placeholders
const values = [cohortName];


pool.query(queryString, values)
  .then((res) => {
    console.log(`Teachers who made assistance requests during cohort "${cohortName}":`);
    res.rows.forEach((row) => {
      console.log(`${row.cohort}: ${row.teacher}`);
    });
  })
  .catch((err) => {
    console.error('Query error:', err.stack);
  })
  .finally(() => {
    pool.end(); 
  });
