for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var i:", i), 100);
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let j:", j), 100);
}

// Output:
// var i: 3 (3 times) ❌
// let j: 0, 1, 2 ✅
