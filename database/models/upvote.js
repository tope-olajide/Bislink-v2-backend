/** Define the Upvote database model/association
 * @exports Upvote
 * @param  {object} sequelize - sequelize
 * @param  {object} DataTypes - sequelize Datatypes
 * @return {object} The Upvote model
 */
export default (sequelize, DataTypes) => {
  const Upvote = sequelize.define('Upvote', {
    businessId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Business',
        key: 'id',
        as: 'businessId',
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      }
    }
  });
  Upvote.associate = (models) => {
    Upvote.belongsTo(models.Business, {
      foreignKey: 'businessId',
      onDelete: 'CASCADE'
    });
    Upvote.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Upvote;
};
