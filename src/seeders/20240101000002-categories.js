'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Technology',
        slug: 'technology',
        description: 'Articles about technology and programming',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Articles about lifestyle and daily life',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Business',
        slug: 'business',
        description: 'Articles about business and entrepreneurship',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
