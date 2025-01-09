const properties = require("./json/properties.json");
const users = require("./json/users.json");

///pool
const { Pool } = require('pg');

const pool = new Pool({
  user: "development",
  password: "development",
  host: "localhost",
  database: "lightbnb",
});



/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1 LIMIT 1;`, [email])
    .then((result) => result.rows[0] || null) 
    .catch((err) => {
      console.error('Error fetching user by email:', err.message);
      throw err;
    });
};


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1 LIMIT 1;`, [id])
    .then((result) => result.rows[0] || null)
    .catch((err) => {
      console.error('Error fetching user by ID:', err.message);
      throw err;
    });
};
/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const { name, email, password } = user;
  return pool
    .query(
      `INSERT INTO users (name, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING *;`,
      [name, email, password]
    )
    .then((result) => result.rows[0])
    .catch((err) => {
      console.error('Error adding user:', err.message);
      throw err;
    });
};



/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(
      `
      SELECT reservations.*, properties.*
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      WHERE reservations.guest_id = $1
      LIMIT $2;
      `,
      [guest_id, limit]
    )
    .then((result) => result.rows) 
    .catch((err) => {
      console.error('Error fetching reservations:', err.message);
      throw err;
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];

  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  
  `;

  // 3. Add filters based on options
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `${queryParams.length === 1 ? 'WHERE' : 'AND'} owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100); // Convert dollars to cents
    queryParams.push(options.maximum_price_per_night * 100); // Convert dollars to cents
    queryString += `${queryParams.length === 2 ? 'WHERE' : 'AND'} (cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length}) `;
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `${queryParams.length === 1 ? 'WHERE' : 'AND'} avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  // 4. Add GROUP BY, ORDER BY, and LIMIT clauses
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  // 1
  const queryString = `
    INSERT INTO properties (
      owner_id, 
      title, 
      description, 
      thumbnail_photo_url, 
      cover_photo_url, 
      cost_per_night, 
      street, 
      city, 
      province, 
      post_code, 
      country, 
      parking_spaces, 
      number_of_bathrooms, 
      number_of_bedrooms
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    )
    RETURNING *;
  `;

  // 2
  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
  ];

  // 3
  return pool
    .query(queryString, queryParams)
    .then((result) => {
      console.log('New property added:', result.rows[0]); // Debugging output
      return result.rows[0];
    })
    .catch((err) => {
      console.error('Error adding property:', err.message);
      throw err;
    });
};


module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
