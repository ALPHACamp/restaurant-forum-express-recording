'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn( 'Restaurants', 'CategoryId', {
      type: Sequelize.INTEGER,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn( 'Restaurants', 'CategoryId' );
  }
};
