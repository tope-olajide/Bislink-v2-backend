/** Define the Notification database model/association
 * @exports Notification
 * @param  {object} sequelize - sequelize
 * @param  {object} Sequelize - sequelize Sequelize
 * @return {object} The Notification model
 */
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      }
    },
    title: {
      type: DataTypes.STRING
    },
    message: {
      type: DataTypes.STRING
    },
    notificationState: {
      type: DataTypes.ENUM,
      values: ['seen', 'unseen'],
      defaultValue: 'unseen'
    },
  });
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Notification;
};
