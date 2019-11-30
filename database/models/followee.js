'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followee = sequelize.define('Followee', {
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      }
    },
    followeeId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      }
    }
  }, {});
  Followee.associate = function(models) {
    Followee.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  return Followee;
};
