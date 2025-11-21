const { test, expect } = require('@playwright/test')
// const { request } = require('http')

test('APi testing get ', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
  expect(response.status()).toBe(200);
  const body = await response.json();
  console.log(body)

})


test('post request : create user', async ({ request }) => {

  const response = await request.post('https://api.restful-api.dev/objects', {
    data: {
      name: "Apple MacBook Pro 16",
      data: {
        year: 2019,
        price: 1849.99,
        "CPU model": "Intel Core i9",
        "Hard disk size": "1 TB"
      }
    }
  });

  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  console.log(responseBody);


  expect(responseBody).toHaveProperty('id');
  expect(responseBody).toHaveProperty('createdAt');
});


test('put request : update user', async ({ request }) => {
  const updatedData = {
    name: "Apple MacBook Pro 16",
    data: {
      year: 2019,
      price: 2049.99,
      "CPU model": "Intel Core i9",
      "Hard disk size": "1 TB",
      color: "space gray"
    }
  };

  const response = await request.put('https://api.restful-api.dev/objects/7', {
    data: updatedData,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  console.log('Status Code:', response.status());
  const responseBody = await response.json();
  console.log('Response:', responseBody);

  expect(response.status()).toBe(200);
  expect(responseBody).toHaveProperty('name', 'Apple MacBook Pro 16');
  expect(responseBody.data).toHaveProperty('color', 'space gray');
})

test.only('Delete request: delete user', async ({ request }) => {
  // Step 1: Create a new object
  const createResponse = await request.post('https://api.restful-api.dev/objects', {
    data: {
      name: "Temp Object",
      data: { test: true }
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
  expect(createResponse.status()).toBe(200);
  const createdBody = await createResponse.json();
  const objectId = createdBody.id;

  // Step 2: Delete the newly created object
  const deleteResponse = await request.delete(`https://api.restful-api.dev/objects/${objectId}`);
  console.log('Status Code:', deleteResponse.status());
  const deleteBody = await deleteResponse.json(); 
  console.log('Response:', deleteBody);

  expect(deleteResponse.status()).toBe(200);
  expect(deleteBody).toHaveProperty('message');
});