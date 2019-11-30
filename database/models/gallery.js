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
      allowNull: true,
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
    }
  });
  Gallery.associate = (models) => {
    Gallery.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };

  return Gallery;
};
