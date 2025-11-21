const numbers = [10,20,30,40,50]

 const total = numbers.reduce((acc,curr) => acc+curr,0)

 console.log(total)


 const found = numbers.find(num => num > 20)
 console.log(found)
