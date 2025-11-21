
const { test, expect } = require('@playwright/test');
const { runQuery } = require('../pages/dbUtils');
const { run } = require('node:test');

// test('Validate user exists in DB', async () => {
//   const users = await runQuery('SELECT * FROM users WHERE username = ?', ['Admin']);
//   expect(users.length).toBeGreaterThan(0);
//   expect(users[0].username).toBe('Admin');
// });
// test('Insert user into DB', async () => {
//   await runQuery('INSERT INTO users (username, password) VALUES (?, ?)', ['tempuser', 'temppass']);
//   const users = await runQuery('SELECT * FROM users WHERE username = ?', ['tempuser']);
//   expect(users.length).toBeGreaterThan(0);
//   expect(users[0].username).toBe('tempuser');
// });

// test('Update user in DB', async () => {
//   await runQuery('UPDATE users SET password = ? WHERE username = ?', ['newpass', 'tempuser']);
//   const users = await runQuery('SELECT * FROM users WHERE username = ?', ['tempuser']);
//   expect(users[0].password).toBe('newpass');
// });

// test('Delete user from DB', async () => {
//   await runQuery('DELETE FROM users WHERE username = ?', ['tempuser']);
//   const users = await runQuery('SELECT * FROM users WHERE username = ?', ['tempuser']);
//   expect(users.length).toBe(0);
// });
// test ('verifying the data from the table,',async() => {

//  const users =  await runQuery('select * from users')

//  console.log(users)
//  expect(users.length).toBe(2);
//  expect(users[0].id).toBe(1);
//   expect(users[1].id).toBe(2);
//   expect(users[0].username).toBe('Admin');
// })


// test('fill empty columns for id =3',async() => {

// await runQuery(`update users set 
//   email = 'vkk22@gmail.com',
//   skills = "java",
//   name = "venkatesh"

//    where id =3`);


//    const user = await runQuery("select * from users where id =3")

//    console.log(user);
//     expect(user[0].email).toBe('vkk22@gmail.com');
    

// })



//  test("check null values for id = 3", async () => {
//   const use = await runQuery('select * from users where id = 3');
//   console.log(use[0]);
//   expect(use[0].experience).toBeNull();
//   expect(use[0].Ranking).toBeNull();
//   expect(use[0].skills).not.toBeNull();
  
// });

// test('full table data',async ()=>{
// const fullTable = await runQuery('select * from users')
// console.table(fullTable);
// console.log(fullTable)

// })

test('inserting values into id =3',async()=>{

await runQuery(`update users set
 experience = '3',
  requiredSkill = 'AI',
 Ranking = '1'
 where id in (3,4) `)

 const user = await runQuery('select * from users where id  in (3,4)')
 console.table(user)
 console.log(user)
})


test('updating values in id =3 ',async ()=>{
await runQuery(`update users set 
 name = 'name updated', 
 skills = 'java updated'
 where id = 3`, 
)
console.table();


})

test('Display full users table', async () => {
  const allUsers = await runQuery('SELECT * FROM users');
  console.log('Full Users Table:');
  console.table(allUsers);
  expect(allUsers.length).toBeGreaterThan(0);
})
