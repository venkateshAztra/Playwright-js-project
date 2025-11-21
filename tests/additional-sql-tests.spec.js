const { test, expect } = require('@playwright/test');
const { runQuery } = require('../pages/dbUtils');

// 1. Database Connection Testing
test('Database connection test', async () => {
  try {
    const result = await runQuery('SELECT 1 as connection_test');
    expect(result[0].connection_test).toBe(1);
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
});

// 2. Stored Procedure Testing
test('Stored procedure test', async () => {
  // Create a simple stored procedure
  await runQuery(`
    CREATE PROCEDURE IF NOT EXISTS get_user_by_id(IN user_id INT)
    BEGIN
      SELECT * FROM users WHERE id = user_id;
    END
  `);
  
  // Call the stored procedure
  const result = await runQuery('CALL get_user_by_id(?)', [1]);
  expect(result[0].length).toBeGreaterThan(0);
  expect(result[0][0].id).toBe(1);
  
  // Clean up
  await runQuery('DROP PROCEDURE IF EXISTS get_user_by_id');
});

// 3. Index Performance Testing
test('Index performance test', async () => {
  // Create test table with index
  await runQuery(`
    CREATE TABLE IF NOT EXISTS index_test (
      id INT PRIMARY KEY AUTO_INCREMENT,
      indexed_column VARCHAR(50),
      non_indexed_column VARCHAR(50),
      INDEX (indexed_column)
    )
  `);
  
  // Insert test data
  const insertValues = [];
  for (let i = 0; i < 1000; i++) {
    insertValues.push(['value' + i, 'data' + i]);
  }
  
  for (const values of insertValues) {
    await runQuery(
      'INSERT INTO index_test (indexed_column, non_indexed_column) VALUES (?, ?)',
      values
    );
  }
  
  // Test query with index
  const startIndexed = Date.now();
  await runQuery('SELECT * FROM index_test WHERE indexed_column = ?', ['value500']);
  const indexedTime = Date.now() - startIndexed;
  
  // Test query without index
  const startNonIndexed = Date.now();
  await runQuery('SELECT * FROM index_test WHERE non_indexed_column = ?', ['data500']);
  const nonIndexedTime = Date.now() - startNonIndexed;
  
  console.log(`Query with index: ${indexedTime}ms`);
  console.log(`Query without index: ${nonIndexedTime}ms`);
  
  // Clean up
  await runQuery('DROP TABLE IF EXISTS index_test');
});

// 4. Data Integrity Constraints Testing
test('Unique constraint test', async () => {
  // Create table with unique constraint
  await runQuery(`
    CREATE TABLE IF NOT EXISTS unique_test (
      id INT PRIMARY KEY AUTO_INCREMENT,
      unique_field VARCHAR(50) UNIQUE
    )
  `);
  
  // Insert first record
  await runQuery('INSERT INTO unique_test (unique_field) VALUES (?)', ['unique_value']);
  
  // Try to insert duplicate - should fail
  try {
    await runQuery('INSERT INTO unique_test (unique_field) VALUES (?)', ['unique_value']);
    expect(false).toBeTruthy(); // Should not reach here
  } catch (error) {
    expect(error.message).toContain('Duplicate entry');
  }
  
  // Clean up
  await runQuery('DROP TABLE IF EXISTS unique_test');
});

// 5. Database Backup and Restore Testing
test('Database backup test', async () => {
  // This is a simplified example - actual implementation would use mysqldump
  // Create a test table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS backup_test (
      id INT PRIMARY KEY AUTO_INCREMENT,
      data VARCHAR(50)
    )
  `);
  
  // Insert test data
  await runQuery('INSERT INTO backup_test (data) VALUES (?)', ['backup_data']);
  
  // Simulate backup by creating a copy table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS backup_test_copy 
    SELECT * FROM backup_test
  `);
  
  // Verify backup
  const backupData = await runQuery('SELECT * FROM backup_test_copy');
  expect(backupData.length).toBeGreaterThan(0);
  expect(backupData[0].data).toBe('backup_data');
  
  // Clean up
  await runQuery('DROP TABLE IF EXISTS backup_test');
  await runQuery('DROP TABLE IF EXISTS backup_test_copy');
});

// 6. Database Schema Validation
test('Schema validation test', async () => {
  // Get table schema
  const tableSchema = await runQuery('DESCRIBE users');
  
  // Verify required columns exist
  const columnNames = tableSchema.map(col => col.Field);
  expect(columnNames).toContain('id');
  expect(columnNames).toContain('username');
  expect(columnNames).toContain('password');
  
  // Verify column types
  const idColumn = tableSchema.find(col => col.Field === 'id');
  expect(idColumn.Type).toContain('int');
  
  const usernameColumn = tableSchema.find(col => col.Field === 'username');
  expect(usernameColumn.Type).toContain('varchar');
});

// 7. Database Trigger Testing
test('Database trigger test', async () => {
  // Create tables for trigger testing
  await runQuery(`
    CREATE TABLE IF NOT EXISTS users_audit (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      action VARCHAR(50),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create trigger
  await runQuery(`
    CREATE TRIGGER IF NOT EXISTS users_after_insert
    AFTER INSERT ON users
    FOR EACH ROW
    BEGIN
      INSERT INTO users_audit (user_id, action) VALUES (NEW.id, 'INSERT');
    END
  `);
  
  // Insert a user to trigger the trigger
  await runQuery(`
    INSERT INTO users (username, password) 
    VALUES ('trigger_test', 'password')
  `);
  
  // Get the ID of the inserted user
  const newUser = await runQuery('SELECT id FROM users WHERE username = ?', ['trigger_test']);
  const userId = newUser[0].id;
  
  // Verify trigger fired
  const auditRecord = await runQuery('SELECT * FROM users_audit WHERE user_id = ?', [userId]);
  expect(auditRecord.length).toBeGreaterThan(0);
  expect(auditRecord[0].action).toBe('INSERT');
  
  // Clean up
  await runQuery('DELETE FROM users WHERE username = ?', ['trigger_test']);
  await runQuery('DROP TRIGGER IF EXISTS users_after_insert');
  await runQuery('DROP TABLE IF EXISTS users_audit');
});

// 8. SQL Injection Prevention Testing
test('SQL injection prevention test', async () => {
  // Unsafe query (for demonstration - don't use this in real code!)
  const unsafeUsername = "' OR '1'='1";
  
  // Safe query using parameterized query
  const safeResult = await runQuery('SELECT * FROM users WHERE username = ?', [unsafeUsername]);
  
  // This should return 0 rows because we're properly escaping the input
  expect(safeResult.length).toBe(0);
});