'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Record, {foreignKey: 'UserName'});
  };
  return User;
};
