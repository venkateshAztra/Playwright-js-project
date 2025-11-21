const { test, expect } = require('@playwright/test');
const { runQuery } = require('../pages/dbUtils');

// 1. Database Connection Test - Most fundamental test
test('Database connection test', async () => {
  const result = await runQuery('SELECT 1 as connection_test');
  expect(result[0].connection_test).toBe(1);
  console.log('✅ Database connection successful');
});

// 2. Basic CRUD Operations - Essential for any database testing
test('Basic CRUD operations', async () => {
  // CREATE - Insert a new record
  await runQuery('INSERT INTO users (username, password) VALUES (?, ?)', 
    ['test_user', 'test_pass']);
  
  // READ - Verify the record was created
  const readResult = await runQuery('SELECT * FROM users WHERE username = ?', 
    ['test_user']);
  expect(readResult.length).toBeGreaterThan(0);
  expect(readResult[0].username).toBe('test_user');
  
  // UPDATE - Modify the record
  await runQuery('UPDATE users SET password = ? WHERE username = ?', 
    ['updated_pass', 'test_user']);
  
  // READ - Verify the update
  const updatedResult = await runQuery('SELECT * FROM users WHERE username = ?', 
    ['test_user']);
  expect(updatedResult[0].password).toBe('updated_pass');
  
  // DELETE - Remove the record
  await runQuery('DELETE FROM users WHERE username = ?', ['test_user']);
  
  // READ - Verify deletion
  const deletedResult = await runQuery('SELECT * FROM users WHERE username = ?', 
    ['test_user']);
  expect(deletedResult.length).toBe(0);
});

// 3. Data Validation - Ensuring data integrity
test('Data validation', async () => {
  const users = await runQuery('SELECT * FROM users WHERE id = ?', [1]);
  
  // Verify record exists
  expect(users.length).toBeGreaterThan(0);
  
  // Verify required fields are not null
  expect(users[0].id).not.toBeNull();
  expect(users[0].username).not.toBeNull();
  
  // Verify data types and formats
  expect(typeof users[0].id).toBe('number');
  expect(typeof users[0].username).toBe('string');
});

// 4. Query with Conditions - Basic filtering
test('Query with conditions', async () => {
  // Query with WHERE clause
  const filteredUsers = await runQuery('SELECT * FROM users WHERE id = ?', [1]);
  expect(filteredUsers.length).toBe(1);
  expect(filteredUsers[0].id).toBe(1);
  
  // Query with multiple conditions
  const multiCondition = await runQuery(
    'SELECT * FROM users WHERE id > ? AND id < ?', 
    [0, 3]
  );
  expect(multiCondition.length).toBe(2);
});

// 5. Parameterized Queries - Basic security
test('Parameterized queries for security', async () => {
  // Using parameterized query to prevent SQL injection
  const safeQuery = await runQuery(
    'SELECT * FROM users WHERE username = ?', 
    ["' OR '1'='1"]
  );
  
  // Should not return all users (which would happen with SQL injection)
  expect(safeQuery.length).toBe(0);
});