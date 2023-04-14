const mysql = require('mysql2');
require('dotenv').config();

class Database {
  constructor(config) {
    this.pool = mysql.createPool(config);
    // Test the database connection when the object is created
    this.pool.getConnection((error, connection) => {
      if (error) {
        console.error('Database connection failed: ' + error.stack);
        process.exit(1); // Exit the Node.js process with an error code
      }
      connection.release();
      console.log('Connected to database.');
    });
  }

  all(sql, params, callback) {
    this.pool.query(sql, params, callback);
  }

  run(sql, params, callback) {
    this.pool.query(sql, params, callback);
  }

  delete(table, conditions, callback) {
    const sql = `DELETE FROM ${table} WHERE ${conditions}`;
    this.pool.query(sql, callback);
  }

  edit(table, data, conditions, callback) {
    const keys = Object.keys(data);
    const values = Object.values(data).map(value => `'${value}'`);
    const assignments = keys.map((key, index) => `${key} = ${values[index]}`).join(', ');
    const sql = `UPDATE ${table} SET ${assignments} WHERE ${conditions}`;
    this.pool.query(sql, callback);
  }

  add(table, data, callback) {
    const keys = Object.keys(data).join(', ');
    const values = Object.values(data).map(value => `'${value}'`).join(', ');
    const sql = `INSERT INTO ${table} (${keys}) VALUES (${values})`;
    this.pool.query(sql, callback);
  }
}

const config = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  port: process.env.MYSQL_PORT || 3306,
  database: process.env.MYSQL_DATABASE || 'defaultdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const db = new Database(config);

module.exports = db;