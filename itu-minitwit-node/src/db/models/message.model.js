const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('message', {
		message_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		author_id:{
      type:DataTypes.INTEGER, 
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    pub_date: {
      type: DataTypes.INTEGER
    }, 
    flagged: {
      type: DataTypes.INTEGER
    }, 
	});
};