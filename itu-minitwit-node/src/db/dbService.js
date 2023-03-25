const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
var path = require('path');

class Database {
  constructor(file) {
    this.db = new sqlite3.Database(file, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log(`Connected to the database: ${file}`);
    });
  }

  all(sql, params = [], callback) {
    this.db.all(sql, params, (err, rows) => {
      callback(err, rows);
    });
  }

  run(sql, values, callback) {
    this.db.run(sql, values, function(err) {
      if (err) {
        throw err;
      }
      callback(this.lastID);
    });
  }

  add(table, data, callback) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    this.run(sql, values, callback);
  }

  delete(table, id, callback) {
    const sql = `DELETE FROM ${table} WHERE id = ?`;
    this.run(sql, [id], callback);
  }

  edit(table, id, data, callback) {
    const sets = Object.entries(data).map(([column, value]) => `${column} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);
    const sql = `UPDATE ${table} SET ${sets} WHERE id = ?`;
    this.run(sql, values, callback);
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Closed the database connection.');
    });
  }
}

//Database Service
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
//DB initialization
const database = new Database('./../../minitwit.db');
//database.run(schema);

module.exports = database;