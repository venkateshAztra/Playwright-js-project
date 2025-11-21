const numbers = [1,2,3,4,5]

const doubled = numbers.map(num => num*2)
console.log(doubled)

const even = numbers.filter(num => num%2==0)
console.log("even numvers are ",even)

const addBoth = numbers.filter(num => num%2==0)
.map(num =>num*num)
console.log(addBoth)