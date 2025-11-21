// function greet (name1){


//     return `hello,${name1}`
// }
// console.log(greet('nijin'))

function greet (name2){

    return `hello, ${name2} How are you`

   
} console.log(greet('nijin'))

// 2. calculator(num1, num2, operation) using Callbacks
function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function calculator(num1, num2, operationCallback) {
  return operationCallback(num1, num2);
}
console.log(calculator(10, 5, add));       // Output: 15
console.log(calculator(10, 5, subtract));  // Output: 5

// 3. repeat(callback, times) - Higher-order function
function repeat(callback, times) {
  for (let i = 0; i < times; i++) {
    callback(i);
  }
}
function sayHello(index) {
  console.log(`Hello ${index}`);
}
repeat(sayHello, 3); // Output: Hello 0, Hello 1, Hello 2
