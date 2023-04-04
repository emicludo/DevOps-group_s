module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("student", {
      message_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      author_id:{
        type:Sequelize.INTEGER, 
        allowNull: false,
      },
      text: {
        type: Sequelize.STRING, 
        allowNull: false,
      },
      pub_date: {
        type: Sequelize.INTEGER
      }, 
      flagged: {
        type: Sequelize.INTEGER
      }, 
    });
  
    return Message;
  };