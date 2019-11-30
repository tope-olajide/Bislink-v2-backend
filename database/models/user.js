/** Define the User database model/association
 * @exports User
 * @param  {object} sequelize - sequelize
 * @param  {object} DataTypes - sequelize Datatypes
 * @return {object} The User model
 */
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    about: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    followers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    followees: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
  });
  User.associate = (models) => {
    User.hasMany(models.Business, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Review, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Favourite, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Follower, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Followee, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Notification, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Gallery, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Upvote, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Downvote, {
      foreignKey: 'userId'
    });
  };
  return User;
};
