const database = require('../db/dbService')

module.exports = class LatestService {
    constructor() { }

    async getLatest() {
        try {
            database.all(query, [no_msgs], (err, rows) => {
                if (err) {
                    logger.log('error', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 500, message: err });
                    var error = new Error("Error retrieving messages from our database");
                    error.status = 500;
                    next(error);
                    return;
                }
                const filteredMsgs = [];
                for (const msg of rows) {
                    const filteredMsg = {};
                    filteredMsg.content = msg.text; req.method
                    filteredMsg.pubDate = msg.pubDate;
                    filteredMsg.user = msg.username;
                    filteredMsgs.push(filteredMsg);
                }
                res.send(filteredMsgs);
            });
        } catch (error) {
            logger.log('error', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 500, message: error });
            var newError = new Error(error);
            newError.status = 500;
            next(newError);
        }
    }

    async updateLatest(number) {
        this.latest = number;
    }
}
