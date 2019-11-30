
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Businesses', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    businessName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tagline: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    businessAddress1: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phoneNumber1: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    website: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    businessImageUrl: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    defaultBusinessImageUrl: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    businessDescription: {
      type: Sequelize.STRING,
      allowNull: false
    },
    viewCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    upvotes: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    downvotes: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    reviewCount: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      } },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('Businesses')
};
