function add(a, b) {
    return a + b;
}
console.log("Traditional way ",add(2, 3))

function subt(a,b){

    return a-b;
}

console.log("Traditional way ", subt(2, 3))

const arrowAdd = (a,b) => a+b;
console.log("Arrow method",arrowAdd(2,3))

const arrowSub = (a,b) =>(a-b)

console.log("arrow sub",arrowSub(5,4))

// template literals

const name = "venatesh"
const city = "Mumbai"
const age = 99
const msg = `the name is ${name} and city is ${city} and the age is ${age}`
console.log(msg)


// one liner arrow function 

const square = n => n*n
console.log(`"square of 4 is ",${square(4)}`)