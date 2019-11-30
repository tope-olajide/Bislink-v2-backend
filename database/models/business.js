/** Define the Business database model/association
 * @exports Business
 * @param  {object} sequelize - sequelize
 * @param  {object} DataTypes - sequelize Datatypes
 * @return {object} The Business model
 */
module.exports = (sequelize, DataTypes) => {
  const Business = sequelize.define('Business', {
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tagline: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    businessAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    businessImageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },    
    defaultBusinessImageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ''
    },
    businessDescription: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    upvotes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    downvotes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
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
  Business.associate = (models) => {
    Business.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    Business.hasMany(models.Review, {
      foreignKey: 'businessId'
    });
    Business.hasMany(models.Favourite, {
      foreignKey: 'businessId'
    });
    Business.hasMany(models.Upvote, {
      foreignKey: 'businessId'
    });
    Business.hasMany(models.Downvote, {
      foreignKey: 'businessId'
    });
  };

  return Business;
};
