/** Define the Gallery database model/association
 * @exports Gallery
 * @param  {object} sequelize - sequelize
 * @param  {object} DataTypes - sequelize Datatypes
 * @return {object} The Gallery model
 */
module.exports = (sequelize, DataTypes) => {
  const Gallery = sequelize.define('Gallery', {
    imageId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      }
    },
    businessId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Businesses',
        key: 'id',
        as: 'businessId',
      }
    },
  });
  Gallery.associate = (models) => {
    Gallery.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };

  return Gallery;
};
