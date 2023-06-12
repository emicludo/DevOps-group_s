const database = require('../db/dbService');
const Latest = require('../model/Latest');

module.exports = class LatestService {
    constructor() { }
  

    async getLatestSeq() {
        const latest = await Latest.findOne();
        return new Promise((resolve, reject) => {
            latest ? resolve(latest.latest_id) : reject(new Error("No rows found"));
        });
    }

    /*
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
    }*/

    async updateLatestSeq(value){
        const latest = await Latest.findOne()
        const update = await Latest.update(
            { latest_id: value },
            { where: { latest_id: latest.latest_id }}
        )
        return new Promise((resolve, reject) => {
            update ? resolve() : reject(update)
        })
    }

    /*
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
    */

}
