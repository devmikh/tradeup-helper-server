const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

// Test model (To be removed)
class User extends Model {}

User.init({
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  modelName: 'User'
});

User.sync();

module.exports = User;