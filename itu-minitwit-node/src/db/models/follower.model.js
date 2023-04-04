module.exports = (sequelize, Sequelize) => {
    const Follower = sequelize.define("student", {
      who_id: {
        type: Sequelize.INTEGER,
      },
      whom_id:{
        type:Sequelize.INTEGER,
      }
    });
  
    return Follower;
  };