const database = require('../db/dbService')

module.exports = class LatestService {
    constructor() { }

    async getLatest() {
        const query = "SELECT latest_id FROM latest;";
        return new Promise((resolve, reject) => {
            database.all(query, [], (err, rows) => {
                if (err || rows.length == 0) {
                    reject(err || new Error("No rows found"));
                } else {
                    const result = rows[0].latest_id;
                    resolve(result);
                }
            });
        })
    }

    async updateLatest(value) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE latest SET latest_id = ?;";
            database.run(query, [value], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

    }
}
