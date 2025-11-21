
// 1. Odd or Even
let a1 = 11;
if (a1 % 2 === 0) {
    console.log("Even number");
} else {
    console.log("Odd num");
}

// 2. Print 1 to 100 Even Numbers
for (let i2 = 1; i2 <= 100; i2++) {
    if (i2 % 2 === 0) {
        console.log(i2);
    }
}

// 3. Print 1 to 10 Odd Numbers
for (let i3 = 1; i3 <= 10; i3++) {
    if (i3 % 2 === 1) {
        console.log(i3);
    }
}

// 4. Factorial Number from 1 to 5
let fact4 = 1;
for (let i4 = 1; i4 <= 5; i4++) {
    fact4 *= i4;
}
console.log(fact4);

// 5. Even Number Count from 1 to 100
let count5 = 0;
for (let i5 = 1; i5 <= 100; i5++) {
    if (i5 % 2 === 0) {
        count5++;
    }
}
console.log(count5);

// 6. Odd Number Count from 1 to 1000
let count6 = 0;
for (let i6 = 1; i6 <= 1000; i6++) {
    if (i6 % 2 === 1) {
        count6++;
    }
}
console.log(count6);

// 7. Sum of Even Numbers from 1 to 500
let sum7 = 0;
for (let i7 = 1; i7 <= 500; i7++) {
    if (i7 % 2 === 0) {
        sum7 += i7;
    }
}
console.log(sum7);

// 8. Sum of Odd Numbers from 1 to 100
let sum8 = 0;
for (let i8 = 1; i8 <= 100; i8++) {
    if (i8 % 2 === 1) {
        sum8 += i8;
    }
}
console.log(sum8);

// 9. Sum of Numbers from 1 to 600
let sum9 = 0;
for (let i9 = 1; i9 <= 600; i9++) {
    sum9 += i9;
}
console.log(sum9);

// 10. Reverse the Number
let a10 = 123;
let i10 = 0, j10 = 0;
while (a10 > 0) {
    i10 = a10 % 10;
    j10 = (j10 * 10) + i10;
    a10 = Math.floor(a10 / 10);
}
console.log(j10);
 



// 11. Palindrome Number or Not
let a11 = 141, n11 = 0;
let i11 = 0, j11 = 0;
n11 = a11;
while (a11 > 0) {
    i11 = a11 % 10;
    j11 = (j11 * 10) + i11;
    a11 = Math.floor(a11 / 10);
}
if (n11 === j11) {
    console.log("palindrome number");
} else {
    console.log("Not a palindrome number....");
}

// 12. Print the Palindrome Numbers from 1 to 1000
for (let k12 = 1; k12 <= 1000; k12++) {
    let a12 = k12, n12 = 0;
    let i12 = 0, j12 = 0;
    n12 = a12;
    while (a12 > 0) {
        i12 = a12 % 10;
        j12 = (j12 * 10) + i12;
        a12 = Math.floor(a12 / 10);
    }
    if (n12 === j12) {
        console.log(j12);
    }
}

// 13. Armstrong Number or Not
let a13 = 153, n13 = 0;
let i13 = 0, j13 = 0;
n13 = a13;
while (a13 > 0) {
    i13 = a13 % 10;
    j13 += (i13 ** 3);
    a13 = Math.floor(a13 / 10);
}
if (n13 === j13) {
    console.log("Amstrong");
} else {
    console.log("Not a amstrong number");
}

// 14. Print Armstrong Numbers from 1 to 600
for (let k14 = 1; k14 <= 600; k14++) {
    let a14 = k14, n14 = 0;
    let i14 = 0, j14 = 0;
    n14 = a14;
    while (a14 > 0) {
        i14 = a14 % 10;
        j14 += (i14 ** 3);
        a14 = Math.floor(a14 / 10);
    }
    if (n14 === j14) {
        console.log(j14);
    }
}

// 15. Count the Digits
let a15 = 12567893, count15 = 0;
while (a15 > 0) {
    a15 = Math.floor(a15 / 10);
    count15++;
}
console.log(count15);

// 16. Sum of Digits
let a16 = 1238, sum16 = 0;
while (a16 > 0) {
    let digit = a16 % 10;
    sum16 += digit;
    a16 = Math.floor(a16 / 10);
}
console.log(sum16);

// 17. Swap Two Numbers Using 3rd Variable
let a17 = 10, b17 = 20, temp17;
temp17 = a17;
a17 = b17;
b17 = temp17;
console.log(a17);
console.log(b17);

// 18. Swap Two Numbers Without 3rd Variable
let a18 = 10, b18 = 20;
a18 = a18 + b18;
b18 = a18 - b18;
a18 = a18 - b18;
console.log(a18);
console.log(b18);

// 19. Fibonacci Series from 1 to 10
let a19 = 0, b19 = 1, c19 = 0;
for (let i19 = 1; i19 <= 10; i19++) {
    c19 = a19 + b19;
    console.log(c19);
    a19 = b19;
    b19 = c19;
}

// 20. Fibonacci Series Sum up to 10
let a20 = 0, b20 = 1, c20 = 0;
for (let i20 = 1; i20 <= 20; i20++) {
    c20 = a20 + b20;
    if (c20 <= 10) {
        console.log(c20);
        a20 = b20;
        b20 = c20;
    }
}
 
// 21. Reverse the string
let name21 = "Welcome";
let res21 = "";
for (let i = name21.length - 1; i >= 0; i--) {
    res21 += name21[i];
}
console.log(res21);

// 22. Palindrome String or not
let name22 = "madam";
let res22 = "";
for (let i = name22.length - 1; i >= 0; i--) {
    res22 += name22[i];
}
if (res22 === name22) {
    console.log("Palindrome string");
} else {
    console.log("Not palindrome string");
}

// 23. Ascending order
let arr23 = [10, 100, 90, 20, 40];
arr23.sort((a, b) => a - b);
console.log(arr23);

// 24. Descending order
let arr24 = [10, 100, 90, 20, 40];
arr24.sort((a, b) => b - a);
console.log(arr24);

// 25. Max and Min number in given array
let arr25 = [10, 100, 90, 20, 40];
arr25.sort((a, b) => b - a);
console.log(arr25);
console.log("Max no:", arr25[0]);
console.log("Min no:", arr25[arr25.length - 1]);

// 26. Vowels count
let name26 = "Welcome";
let vowelsCount26 = 0;
for (let ch of name26) {
    if ("aeiouAEIOU".includes(ch)) {
        vowelsCount26++;
    }
}
console.log(vowelsCount26);

// 27. Consonants and vowels count
let name27 = "Welcome";
let vowelsCount27 = 0, consonantCount27 = 0;
for (let ch of name27) {
    if ("aeiouAEIOU".includes(ch)) {
        vowelsCount27++;
    } else {
        consonantCount27++;
    }
}
console.log(vowelsCount27);
console.log(consonantCount27);

// 28. Print vowels and consonants separately
let name28 = "Welcome";
let vowels28 = "", consonants28 = "";
for (let ch of name28) {
    if ("aeiouAEIOU".includes(ch)) {
        vowels28 += ch;
    } else {
        consonants28 += ch;
    }
}
console.log(vowels28);
console.log(consonants28);

// 29. Count of each character in given String
let name29 = "Welcome";
let freq29 = {};
for (let ch of name29) {
    freq29[ch] = (freq29[ch] || 0) + 1;
}
console.log(freq29);

// 30. Count of each word in a given String
let name30 = "Welcome to java sql java to java sql plsql";
let words30 = name30.split(" ");
let freq30 = {};
for (let word of words30) {
    freq30[word] = (freq30[word] || 0) + 1;
}
console.log(freq30);

// 31. Print the word count in given string
let name31 = "Welcome to java sql java to java sql plsql";
let words31 = name31.split(" ");
console.log(words31.length);

// 32. Convert string into init cap
let name32 = "Welcome to java sql java to java sql plsql";
let words32 = name32.split(" ");
let res32 = words32.map(w => w[0].toUpperCase() + w.substring(1)).join(" ");
console.log(res32);

// 33. Count of caps, small, digit, and special characters
let name33 = "Welcome@123456";
let uCount = 0, sCount = 0, dCount = 0, spCount = 0;
for (let ch of name33) {
    if (/[A-Z]/.test(ch)) uCount++;
    else if (/[a-z]/.test(ch)) sCount++;
    else if (/[0-9]/.test(ch)) dCount++;
    else spCount++;
}
console.log("Caps count:", uCount);
console.log("small count:", sCount);
console.log("digit count:", dCount);
console.log("sp count:", spCount);

// 34. Convert all small case into caps and reverse
let name34 = "WelcomE";
let res34 = "";
for (let ch of name34) {
    if (ch === ch.toLowerCase()) res34 += ch.toUpperCase();
    else res34 += ch.toLowerCase();
}
console.log(res34);

// 35. Prime number or not
let n35 = 10;
let isPrime35 = true;
for (let i = 2; i <= Math.floor(n35 / 2); i++) {
    if (n35 % i === 0) {
        isPrime35 = false;
        break;
    }
}
console.log(isPrime35 ? "prime no" : "not a prime no");

// 36. Print prime numbers from 1 to 100
for (let n = 1; n <= 100; n++) {
    let isPrime = true;
    if (n === 1) continue;
    for (let i = 2; i <= Math.floor(n / 2); i++) {
        if (n % i === 0) {
            isPrime = false;
            break;
        }
    }
    if (isPrime) console.log(n);
}

// 37. Prime number count from 1 to 500
let pCount = 0;
for (let n = 1; n <= 500; n++) {
    let isPrime = true;
    if (n === 1) continue;
    for (let i = 2; i <= Math.floor(n / 2); i++) {
        if (n % i === 0) {
            isPrime = false;
            break;
        }
    }
    if (isPrime) pCount++;
}
console.log(pCount);


// ===================== Arrays =====================
// Definition:
// An array is a collection of elements stored in a single variable. Elements are accessed by index (starting from 0).

// 1. Reverse an array
let arr = [1, 2, 3, 4, 5];
arr.reverse();
console.log(arr);  // [5, 4, 3, 2, 1]

// 2. Find maximum and minimum elements in an array
let numbers = [10, 5, 100, 50];
let max = Math.max(...numbers);
let min = Math.min(...numbers);
console.log("Max:", max); // 100
console.log("Min:", min); // 5

// 3. Remove duplicates from an array
let arrWithDuplicates = [1, 2, 2, 3, 4, 4, 5];
let unique = [...new Set(arrWithDuplicates)];
console.log(unique);  // [1, 2, 3, 4, 5]

// 4. Sum and average of array elements
let arrNumbers = [10, 20, 30, 40];
let sum = arrNumbers.reduce((acc, val) => acc + val, 0);
let avg = sum / arrNumbers.length;
console.log("Sum:", sum); // 100
console.log("Average:", avg); // 25


let arraynum = [1,2,3,4,5]
let sum1 =0;
for ( let i =0; i< arraynum.length; i++){

    sum1 += arraynum[i]
} console.log(sum)

// ===================== Strings, StringBuffer, and StringBuilder (Concepts) =====================
// Definition:
// String: Sequence of characters (immutable in JavaScript).
// StringBuffer/StringBuilder: Java concepts for mutable strings; in JS, use arrays or concatenation efficiently.

// 1. Reverse a string
let str = "hello";
let reversed = str.split("").reverse().join("");
console.log(reversed);  // "olleh"

// 2. Count vowels in a string
let sentence = "Hello World";
let vowels = sentence.match(/[aeiou]/gi);
console.log(vowels ? vowels.length : 0);  // 3

// 3. Capitalize the first letter of each word
let lowerCaseStr = "hello world";
let capitalized = lowerCaseStr.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
console.log(capitalized);  // "Hello World"

// 4. Efficient string concatenation (like StringBuilder)
let parts = [];
parts.push("Hello");
parts.push(" ");
parts.push("World");
let result = parts.join("");
console.log(result);  // "Hello World"


// ===================== Loops and Conditional Statements =====================
// Definition:
// Loops: Repeat a block of code multiple times.
// Conditional Statements: Perform actions based on conditions.

// 1. Check if a number is even or odd
let num = 7;
if (num % 2 === 0) {
  console.log("Even");
} else {
  console.log("Odd");
}

// 2. Print even numbers from 1 to 10
for(let i = 1; i <= 10; i++) {
  if(i % 2 === 0) {
    console.log(i);
  }
}

// 3. Calculate factorial of a number
let factorialNum = 5;
let fact = 1;
for(let i = 1; i <= factorialNum; i++) {
  fact *= i;
}
console.log(fact);  // 120

// 4. Find sum of digits of a number
let numberToSum = 1234;
let sumOfDigits = 0;
while (numberToSum > 0) {
  sumOfDigits += numberToSum % 10;
  numberToSum = Math.floor(numberToSum / 10);
}
console.log(sumOfDigits);  // 10
