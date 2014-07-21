
validateIds = (ids) ->
  for id in ids
    return false unless Number.isFinite id
  true

console.log validateIds [10,20,30]
console.log validateIds [10,'',30]
console.log validateIds [10,undefined,30]
console.log validateIds [10,1/0,30]
console.log validateIds [10,30,{}]
console.log validateIds [10,30,[]]
console.log validateIds []
