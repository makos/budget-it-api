'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: DataTypes.STRING,
    Password: DataTypes.STRING,
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Record, {as: 'Records', foreignKey: 'UserID'});
  };
  return User;
};
