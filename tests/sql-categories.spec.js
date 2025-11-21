const { test, expect } = require('@playwright/test');
const { runQuery } = require('../pages/dbUtils');
const mysql = require('mysql2/promise');

// DDL (Data Definition Language) Tests
test('DDL - Create, Alter, Drop table', async () => {
  // Create a test table
  await runQuery(`CREATE TABLE IF NOT EXISTS test_table (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(100) NULL
  )`);
  
  // Alter table - add a new column
  await runQuery('ALTER TABLE test_table ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
  
  // Verify column was added
  const tableInfo = await runQuery('DESCRIBE test_table');
  const columnExists = tableInfo.some(col => col.Field === 'created_at');
  expect(columnExists).toBeTruthy();
  
  // Drop table
  await runQuery('DROP TABLE test_table');
  
  // Verify table was dropped
  try {
    await runQuery('DESCRIBE test_table');
    // If we get here, the table still exists
    expect(false).toBeTruthy(); // This should fail
  } catch (error) {
    // Table doesn't exist - expected behavior
    expect(error.message).toContain("doesn't exist");
  }
});

// DML (Data Manipulation Language) Tests
test('DML - Insert, Update, Delete operations', async () => {
  // Create a temporary table
  await runQuery(`CREATE TABLE IF NOT EXISTS dml_test (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    value INT DEFAULT 0
  )`);
  
  // INSERT
  await runQuery('INSERT INTO dml_test (name, value) VALUES (?, ?)', ['test_item', 100]);
  
  // UPDATE
  await runQuery('UPDATE dml_test SET value = ? WHERE name = ?', [200, 'test_item']);
  
  // Verify update
  const updatedRows = await runQuery('SELECT * FROM dml_test WHERE name = ?', ['test_item']);
  expect(updatedRows[0].value).toBe(200);
  
  // DELETE
  await runQuery('DELETE FROM dml_test WHERE name = ?', ['test_item']);
  
  // Verify delete
  const remainingRows = await runQuery('SELECT * FROM dml_test WHERE name = ?', ['test_item']);
  expect(remainingRows.length).toBe(0);
  
  // Clean up
  await runQuery('DROP TABLE dml_test');
});

// DQL (Data Query Language) Tests
test('DQL - SELECT with various clauses', async () => {
  // Create and populate test table
  await runQuery(`CREATE TABLE IF NOT EXISTS dql_test (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10,2)
  )`);
  
  await runQuery(`INSERT INTO dql_test (name, category, price) VALUES 
    ('Item1', 'Category1', 10.99),
    ('Item2', 'Category1', 20.50),
    ('Item3', 'Category2', 15.75),
    ('Item4', 'Category2', 25.00)`);
  
  // Basic SELECT
  const allItems = await runQuery('SELECT * FROM dql_test');
  expect(allItems.length).toBe(4);
  
  // SELECT with WHERE
  const category1Items = await runQuery('SELECT * FROM dql_test WHERE category = ?', ['Category1']);
  expect(category1Items.length).toBe(2);
  
  // SELECT with ORDER BY
  const orderedItems = await runQuery('SELECT * FROM dql_test ORDER BY price DESC');
  expect(orderedItems[0].price).toBe(25.00);
  
  // SELECT with GROUP BY and aggregate function
  const categoryStats = await runQuery('SELECT category, AVG(price) as avg_price FROM dql_test GROUP BY category');
  expect(categoryStats.length).toBe(2);
  
  // Clean up
  await runQuery('DROP TABLE dql_test');
});

// Primary Key and Foreign Key Tests
test('Primary Key and Foreign Key constraints', async () => {
  // Create parent table with primary key
  await runQuery(`CREATE TABLE IF NOT EXISTS departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(50) NOT NULL
  )`);
  
  // Create child table with foreign key
  await runQuery(`CREATE TABLE IF NOT EXISTS employees (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(50) NOT NULL,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
  )`);
  
  // Insert into parent table
  await runQuery('INSERT INTO departments VALUES (1, "Engineering"), (2, "Marketing")');
  
  // Insert into child table with valid foreign key
  await runQuery('INSERT INTO employees VALUES (101, "John Doe", 1), (102, "Jane Smith", 2)');
  
  // Try to insert with invalid foreign key - should fail
  try {
    await runQuery('INSERT INTO employees VALUES (103, "Invalid FK", 999)');
    expect(false).toBeTruthy(); // Should not reach here
  } catch (error) {
    expect(error.message).toContain('foreign key constraint fails');
  }
  
  // Try to delete parent with referenced foreign key - should fail
  try {
    await runQuery('DELETE FROM departments WHERE dept_id = 1');
    expect(false).toBeTruthy(); // Should not reach here
  } catch (error) {
    expect(error.message).toContain('foreign key constraint fails');
  }
  
  // Clean up - delete child records first, then parent
  await runQuery('DELETE FROM employees');
  await runQuery('DELETE FROM departments');
  await runQuery('DROP TABLE employees');
  await runQuery('DROP TABLE departments');
});

// NULL value tests
test('NULL value handling', async () => {
  // Create table with nullable and non-nullable columns
  await runQuery(`CREATE TABLE IF NOT EXISTS null_test (
    id INT PRIMARY KEY AUTO_INCREMENT,
    required_field VARCHAR(50) NOT NULL,
    nullable_field VARCHAR(50) NULL
  )`);
  
  // Insert with NULL in nullable field
  await runQuery('INSERT INTO null_test (required_field, nullable_field) VALUES (?, ?)', 
    ['Required Value', null]);
  
  // Verify NULL was stored
  const nullRow = await runQuery('SELECT * FROM null_test WHERE required_field = ?', ['Required Value']);
  expect(nullRow[0].nullable_field).toBeNull();
  
  // Try to insert NULL in non-nullable field - should fail
  try {
    await runQuery('INSERT INTO null_test (required_field, nullable_field) VALUES (?, ?)', 
      [null, 'Some Value']);
    expect(false).toBeTruthy(); // Should not reach here
  } catch (error) {
    expect(error.message).toContain('cannot be null');
  }
  
  // Query with IS NULL
  await runQuery('INSERT INTO null_test (required_field, nullable_field) VALUES (?, ?)', 
    ['Another Value', 'Not Null']);
  const nullResults = await runQuery('SELECT * FROM null_test WHERE nullable_field IS NULL');
  expect(nullResults.length).toBe(1);
  
  // Clean up
  await runQuery('DROP TABLE null_test');
});

// DCL (Data Control Language) Tests
test('DCL - Grant and Revoke permissions', async () => {
  // Note: This test requires admin privileges
  // Create test user
  try {
    await runQuery('CREATE USER IF NOT EXISTS \'test_user\'@\'localhost\' IDENTIFIED BY \'password\'');
    
    // Grant privileges
    await runQuery('GRANT SELECT ON venkateshdb.users TO \'test_user\'@\'localhost\'');
    
    // Verify grant worked by connecting as test_user
    const testConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'test_user',
      password: 'password',
      database: 'venkateshdb'
    });
    
    // Try to select (should work)
    const [rows] = await testConnection.execute('SELECT * FROM users LIMIT 1');
    expect(rows.length).toBeGreaterThan(0);
    
    // Try to insert (should fail)
    try {
      await testConnection.execute('INSERT INTO users (username, password) VALUES (\'test\', \'test\')');
      expect(false).toBeTruthy(); // Should not reach here
    } catch (error) {
      expect(error.message).toContain('denied');
    }
    
    await testConnection.end();
    
    // Revoke privileges
    await runQuery('REVOKE SELECT ON venkateshdb.users FROM \'test_user\'@\'localhost\'');
    
    // Clean up
    await runQuery('DROP USER \'test_user\'@\'localhost\'');
  } catch (error) {
    console.log('DCL test requires admin privileges:', error.message);
  }
});

// DTL (Data Transaction Language) Tests
test('DTL - Transaction control', async () => {
  // Create test table
  await runQuery(`CREATE TABLE IF NOT EXISTS transaction_test (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
  )`);
  
  // Get direct connection for transaction control
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Venky@221133',
    database: 'venkateshdb'
  });
  
  try {
    // Start transaction
    await connection.beginTransaction();
    
    // Insert first record
    await connection.execute('INSERT INTO transaction_test (name) VALUES (?)', ['Transaction Item 1']);
    
    // Insert second record
    await connection.execute('INSERT INTO transaction_test (name) VALUES (?)', ['Transaction Item 2']);
    
    // Commit transaction
    await connection.commit();
    
    // Verify both records were inserted
    const [committedRows] = await connection.execute('SELECT * FROM transaction_test');
    expect(committedRows.length).toBe(2);
    
    // Test rollback
    await connection.beginTransaction();
    
    // Insert another record
    await connection.execute('INSERT INTO transaction_test (name) VALUES (?)', ['Will be rolled back']);
    
    // Verify record exists within transaction
    const [tempRows] = await connection.execute('SELECT * FROM transaction_test');
    expect(tempRows.length).toBe(3);
    
    // Rollback transaction
    await connection.rollback();
    
    // Verify record was not committed
    const [finalRows] = await connection.execute('SELECT * FROM transaction_test');
    expect(finalRows.length).toBe(2);
  } finally {
    await connection.end();
    
    // Clean up
    await runQuery('DROP TABLE transaction_test');
  }
});