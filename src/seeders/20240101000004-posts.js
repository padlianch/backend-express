'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get admin user ID and category ID
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1`
    );
    const [categories] = await queryInterface.sequelize.query(
      `SELECT id FROM categories WHERE slug = 'technology' LIMIT 1`
    );

    if (users.length === 0 || categories.length === 0) {
      console.log('Skipping posts seeder: required data not found');
      return;
    }

    const userId = users[0].id;
    const categoryId = categories[0].id;

    await queryInterface.bulkInsert('posts', [
      {
        userId,
        categoryId,
        title: 'Getting Started with Node.js',
        slug: 'getting-started-with-nodejs',
        content: 'Node.js is a JavaScript runtime built on Chrome V8 JavaScript engine. It allows you to run JavaScript on the server side...',
        excerpt: 'Learn the basics of Node.js and how to get started with server-side JavaScript.',
        status: 'published',
        publishedAt: new Date(),
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId,
        categoryId,
        title: 'Understanding REST API Design',
        slug: 'understanding-rest-api-design',
        content: 'REST (Representational State Transfer) is an architectural style for designing networked applications...',
        excerpt: 'Best practices for designing RESTful APIs.',
        status: 'published',
        publishedAt: new Date(),
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Get post IDs and tag IDs for post_tags
    const [posts] = await queryInterface.sequelize.query(
      `SELECT id FROM posts ORDER BY id`
    );
    const [tags] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM tags`
    );

    const tagMap = {};
    tags.forEach(t => tagMap[t.slug] = t.id);

    if (posts.length >= 2 && Object.keys(tagMap).length > 0) {
      await queryInterface.bulkInsert('post_tags', [
        { postId: posts[0].id, tagId: tagMap['javascript'], createdAt: new Date(), updatedAt: new Date() },
        { postId: posts[0].id, tagId: tagMap['nodejs'], createdAt: new Date(), updatedAt: new Date() },
        { postId: posts[0].id, tagId: tagMap['tutorial'], createdAt: new Date(), updatedAt: new Date() },
        { postId: posts[1].id, tagId: tagMap['nodejs'], createdAt: new Date(), updatedAt: new Date() },
        { postId: posts[1].id, tagId: tagMap['tutorial'], createdAt: new Date(), updatedAt: new Date() }
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('post_tags', null, {});
    await queryInterface.bulkDelete('posts', null, {});
  }
};
