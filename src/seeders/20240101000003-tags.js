'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tags', [
      { name: 'JavaScript', slug: 'javascript', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Node.js', slug: 'nodejs', createdAt: new Date(), updatedAt: new Date() },
      { name: 'React', slug: 'react', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Database', slug: 'database', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tutorial', slug: 'tutorial', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tags', null, {});
  }
};
