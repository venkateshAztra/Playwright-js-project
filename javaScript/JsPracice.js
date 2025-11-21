let message = 'Hello, Playwright!';
const Number = 10;
const isActive = true;
let a =10;

console.log(message); 
console.log(Number);
console.log(typeof(Number));
console.log("End upto here just checking ",typeof(a)) 


let a1 = 10;
console.log(typeof(a1))

let a2 = "Venky"
console.log(typeof(a2))

let a3 = 235.7
console.log(typeof(a3))

let a4 = 0.5
console.log(typeof(a4))

let required = true;
console.log(typeof(required));

// const flag = true;

// if(!flag){
//     console.log("condition satisfied")
// }
// else
// {
//     console.log("condition not satisfied")
// }

let flag = true;
if (!flag) {
    console.log("condition satisfied"); // This will run
} else {
    console.log("condition not satisfied");
}


let i =0;
while(i<5){
    i++;
  //  console.log("i>5 it wont run because condtion not satisfied ")
    console.log("i<5, satisfied condition, numbers are ,",i)


    
}

let z = 0;
do {
    z++;
        console.log("op is",z);

} while ( z < 5);
// console.log("z>5 here condition not satisfied but it executes once so output is one")


// for loop
for(let k=1;k<5;k++){
    console.log("for loop is",k)
}

console.log("*********************")
let n =0
for (let j=1;j<=100;j++){

    if(j%2 == 0  && j% 5==0){

n++
    console.log(j)
    if (n==3)
        break
}}

console.log("==========Arrays=============")
var marks = [1,2,3,4,5,6,7]
console.log(marks[0])
console.log(marks)
console.log(marks.length)
console.log(marks[5])
console.log("Replacing an arrow")
marks[0]=14
marks[1]="two"
console.log(marks[0])
console.log(marks[1])
console.log(marks)
console.log("Adding an arrow push")
marks.push(55)
console.log("After push (added an element at the end):", marks);
marks.pop();
console.log("After pop (delete an element from the arrayat the end):", marks);
marks.unshift(1)
console.log("After done unshift, an element is added first of an array:", marks);
console.log(marks.indexOf(70))
console.log(marks.indexOf(30)); 
console.log(marks)
subArray = marks.slice(2,5)
console.log("After slice: it counts from starting num to given value",subArray)
console.log(marks.includes(120))
marks[2]=15
console.log(marks)


var sum =0
for (let b=0;b<marks.length;b++){
    sum = sum+marks[b]
    console.log(sum)

}

    console.log("total sum of the array",sum)
    console.log(marks)
// reduce filter map
let total = marks.reduce((sum,mark)=>sum+mark,0)
console.log('Sum with the reduce method :',total)

console.log('==============************=============')
var scores = [12,23,14,16]
var evenScores =[]

for (let i =0;i<scores.length;i++){
if(scores[i]%2==0){
    evenScores.push(scores[i])
}

}
console.log("even numbers with for loop",evenScores)

var score = [12,23,14,16]
const evenScore = score.filter(score => score % 2==0)
console.log('even numbers with filter method',evenScore)

var num = [2,3,4,5,6]
   const   evenNum = num.filter(num => num % 2 == 0)
   console.log("even num with filters",evenNum)

   console.log("=================================")
   console.log("")
   const mul = num.map(num => num*3)
   console.log("Multiply using map",mul)

var nums = [1,2,3,4,5,6]
var mult = nums.map(nums=> nums*5)
console.log(mult)

console.log("=============================")
console.log("")

   let fruits =["banana","apple","goa","cherrys","Banana"]
   fruits.sort()
   console.log("Sorting order, Captial letter first always",fruits)


