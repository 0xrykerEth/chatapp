const Sequelize = require("sequelize");

const sequelize = new Sequelize('chatapp','root','rajatraj',{
dialect: 'mysql',
 host: 'localhost',
})


module.exports = sequelize;