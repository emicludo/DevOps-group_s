module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("student", {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username:{
        type:Sequelize.STRING, 
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING, 
        allowNull: false,
      },
      pw_hash: {
        type: Sequelize.STRING, 
        allowNull: false,
      }
    });
  
    return User;
  };