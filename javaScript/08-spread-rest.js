// 1. Array Spread: clone and merge

 const originalArray = [1,2,3]

 const clinedArray = [...originalArray]
 const mergedArry = [...originalArray,4,5,6]
 console.log(clinedArray)
 console.log(mergedArry)


 // // 2. Object Spread: clone and add props

 const originalObject = {name : "venkatesh", city: "warangal"}
 const clonedObject = {...originalObject}
 const mergedObject = {...originalObject, age:99}
 console.log(clonedObject)
 console.log(mergedObject)

 // Mixed: destructure + rest

 const colors = ['red','blue','green','goa','kima']
 const[first,second,...reset] = colors
 console.log(first)
 console.log(second)
 console.log(reset)