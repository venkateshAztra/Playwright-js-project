const { runQuery } = require('../pages/dbUtils');

(async () => {
  try {
    const users = await runQuery('SELECT * FROM users');
    console.log('Users:', users);
  } catch (err) {
    console.error('Database error:', err);
  }
})();