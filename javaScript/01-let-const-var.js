function testScope() {
  if (true) {
    var a = 10;
    let b = 20;
    const c = 30;
  }
  console.log(a); // ✅
//   console.log(b); // ❌
//   console.log(c); // ❌
}
testScope();


// 02-let-vs-const-reassignment.js

let city = "Hyderabad";
console.log("Original city:", city);
city = "Warangal"; // ✅ allowed
console.log("Updated city:", city);

const pinCode = 500001;
console.log("Original pinCode:", pinCode);
pinCode = 506001; // ❌ not allowed (will throw error)
console.log("Updated pinCode:", pinCode);

