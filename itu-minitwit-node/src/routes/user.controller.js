const sequelize = require('../db/dbSetup');
var User = require('../db/models/user.model')(sequelize);

sequelize.sync().then(() => {

    User.findAll({ limit: 10 }).then(res => {
        console.log(res)
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });

}).catch((error) => {
    console.error('Error :(', error);
});
