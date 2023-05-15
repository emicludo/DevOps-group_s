const database = require('../db/dbService');
const { Op } = require('sequelize');
const User = require('./User');
const Follower = require('./Follower');

// Get followers of a user
module.exports = class GetFollowersFromUser {
  
  async getFollowersFromUser(userid, limit) {
    const limitParsed = parseInt(limit) || 1000;
    try {

      const whom = await Follower.findAll({
        attributes: ['whom_id'],
        where: {
          who_id: userid,
        }
      })
  
      const IDs = [];
      whom.forEach((whom) => {
        IDs.push(whom.whom_id)
      })

      const followers = await User.findAll({
        attributes: ['username'],
        where: {
          user_id: {
            [Op.in]: IDs,
          }
        },
        limit: limitParsed,
      })
      const filteredFllws = followers.map((follower) => follower.username);
      return filteredFllws;
    } catch (err) {
      return err;
    }
  }
}