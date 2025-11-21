// let count = 0;
// for (let i =1;i<=100;i++){

//     if(i%2!==0){

//         count++
//     }
// }

// console.log(count)


// let i =12;
// if(i%2==0){

//     console.log('even num')
// }else{

//     console.log('odd numbe')
// }

// for (let i=1;i<=100;i++){

//     if (i%2==0){

//         console.log("Even numbers are ",i)
//     }
// }

// for (let i =1;i<=10; i++){

//     if(i%2 == 1){
//         console.log('odd Numbers are',i)
//     }
// }

// let fact = 1;
// for(let i =1; i<5; i++){

//     fact *=i 
// }
// console.log('factorial num',fact) //fact = 1 * 1 * 2 * 3 * 4 = 24
////////////////////////////////////////////////////////////////////////
// let countEven = 0;
// for(let i=1; i<=100;i++){

//     if(i%2 == 0){

//         countEven++
//     }
// }console.log('Even num count',countEven)

/////////////////////////////////////////////////////////////////////////

// let count = 0;
// for (let i =1; i<=10;i++){

//     if(i%2==1){
//         count++
//     }
// } console.log('odd count',count)

////////////////////////////////////////////////////////////////////////////////


// let sumEven = 0;
// for(let i =1; i<=10; i++){

//     if(i%2==0){
//         sumEven += i
//     }

// } console.log(sumEven)

//////////////////////////////////////////////////////

// let sumodd =0
// for(let i =1;i<=10;i++){

//     if(i%2==1){

//         sumodd += i;
//     }
// } console.log(sumodd)

/////////////////////////////////////////////////////////

// let sumallNumbers = 0;
// for(let i=1;i<=10; i++){

//     sumallNumbers += i;

// } console.log('sum of all numbers',sumallNumbers)

/////////////////////////////////////////////////////////////

// let number = 123;
// let reversed = number.toString().split('').reverse().join('');
// console.log('revresed',reversed)

// let num = 123;
// let rev = number.toString().split('').reverse().join('')
// console.log(rev)


// let number = 123;
// let reversed = 0;

// while (number > 0) {
//   let digit = number % 10;           // Get the last digit
//   reversed = (reversed * 10) + digit; // Add the digit to the reversed number
//   number = Math.floor(number / 10);   // Remove the last digit from the original number
// }

// console.log(reversed);  // Output: 321

let i =123;
let j =0;
let k = 0;

while(i>0){

    k = i%10;
    j = j*10 + k;
    i = Math.floor(i/10)
} console.log(j)



//////////////////////////////////////

