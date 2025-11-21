const users = { name : "venkatesh", age : 99, city : "warangal"}

// 1. Object.keys() → array of keys

const keys = Object.keys(users)
console.log(keys)

const user = { name : "venky", age: 25, city : "warangel"}

const key = Object.keys(user)
const key1= Object.values(user)
console.log(key)
console.log(key1)

const entries = Object.entries(user)
console.log(entries)