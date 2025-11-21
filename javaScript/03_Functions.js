// function greet(name = "Guest") {
//     console.log(`Hello, ${name}`);
//   }
  
//   greet();           // Output: Hello, Guest
//   greet("Venkatesh"); // Output: Hello, Venkatesh
  



function greet1(name = "defaultName") {
    console.log(`Hello, ${name}`);

}

greet1();            
greet1("Venkatehs");  


// 7. Write a function that accepts a callback and a message.
function showMessage(callback, message) {
    callback(message);
  }
  
  showMessage(console.log, "what");
  

// // Function expression (anonymous function)
// const sum = function(a, b) {
//     return a + b;
//   };



const sum = function(a,b){

    return a+b;
};

console.log(sum(3,5))


const diff = function(a,b){

    return a-b;


};

console.log(diff(7,6));




const mul = function(a,b){

    return a*b;
    return a+b;

}


console.log(mul(5,5));



// Arrow function (ES6)
const multiply = (a, b) => a * b;

console.log(multiply(2, 3));


const add = (a,b)=> a*b;
console.log(add(2,4));


const diff1 = (a,b) =>a-b;
console.log(diff(8,23));

const mul1 = (a,b) => a*b;
console.log(mul(6,5));

const hdhfdd = (a,b) =>a+b;
console.log(hdhfdd(8,9))


function add1(a,b)
{
  return  a+b
}
  console.log(add1(2,3))


  function add2(a,b)
  {
    return a-b
  }

let sum1 = add2(10,5)
console.log(sum1)
  console.log(add2(5,6))
