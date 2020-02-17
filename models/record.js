'use strict';
module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define('Record', {
    RecordID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    Type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    Comment: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    RecordType: {
      type: DataTypes.ENUM('Income', 'Expense'),
      allowNull: false,
    },
    UserName: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'Name',
      },
    },
  });
  Record.associate = function(models) {
    Record.belongsTo(models.User, {foreignKey: 'UserName'});
  };
  return Record;
};
