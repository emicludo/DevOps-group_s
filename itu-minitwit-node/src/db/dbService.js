const mysql = require('mysql2');
require('dotenv').config();

const { queryDurationHistogram, queryErrorCounter } = require('../metrics/metrics');
class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config);
     // Test the database connection when the object is created
     this.connection.connect((error) => {
      if (error) {
        console.error('Database connection failed: ' + error.stack);
        process.exit(1); // Exit the Node.js process with an error code
      }
      console.log('Connected to database.');

    });
  }

  all(sql, params, callback) {
    const queryStartTime = process.hrtime();
    this.connection.query(sql, params, (error, results, fields) => {
      const queryDuration = process.hrtime(queryStartTime);
      const queryDurationSeconds = queryDuration[0] + queryDuration[1] / 1e9;
      const query = this.connection.format(sql, params);
      if (error) {
        queryErrorCounter.labels(query, error.code).inc();
        callback(error, results, fields);
      } else {
        queryDurationHistogram.observe(queryDurationSeconds);
        callback(error, results, fields);
      }
    });
  }

  run(sql, params, callback) {
    this.connection.query(sql, params, callback);
  }

  delete(table, conditions, callback) {
    const sql = `DELETE FROM ${table} WHERE ${conditions}`;
    this.connection.query(sql, callback);
  }

  edit(table, data, conditions, callback) {
    const keys = Object.keys(data);
    const values = Object.values(data).map(value => `'${value}'`);
    const assignments = keys.map((key, index) => `${key} = ${values[index]}`).join(', ');
    const sql = `UPDATE ${table} SET ${assignments} WHERE ${conditions}`;
    this.connection.query(sql, callback);
  }

  add(table, data, callback) {
    const keys = Object.keys(data).join(', ');
    const values = Object.values(data).map(value => `'${value}'`).join(', ');
    const sql = `INSERT INTO ${table} (${keys}) VALUES (${values})`;
    this.connection.query(sql, callback);
  }
}

const config = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  port: process.env.MYSQL_PORT || 3306,
  database: process.env.MYSQL_DATABASE || 'defaultdb'
};

const db = new Database(config);

module.exports = db;