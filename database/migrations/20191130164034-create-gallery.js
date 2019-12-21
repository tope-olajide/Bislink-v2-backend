

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Galleries', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    imageId: {
      type: Sequelize.STRING
    },
    userId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
    },
    businessId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Businesses',
        key: 'id',
        as: 'businessId',
      }
    },
    imageUrl: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Galleries')
};
