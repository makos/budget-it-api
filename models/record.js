'use strict';
module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define('Record', {
      RecordID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
      },
      Amount: { 
          type: DataTypes.DECIMAL(10,2),
          allowNull: false
      },
      Date: {
          type: DataTypes.DATEONLY,
          allowNull: false
      },
      Type: {
          type: DataTypes.TEXT('tiny'),
          allowNull: true,
          defaultValue: ''
      },
      Comment: {
          type: DataTypes.TEXT('tiny'),
          allowNull: true,
          defaultValue: ''
      },
      RecordType: {
          type: DataTypes.ENUM('Income', 'Expense'),
          allowNull: false
      }
  }, {
      timestamps: false
  });
  Record.associate = function(models) {
    // associations can be defined here
  };
  return Record;
};
