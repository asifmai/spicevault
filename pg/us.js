const _ = require('underscore');
const a = [ "5cf2956b1771e6157cc2b256", "5cf296751771e6157cc2b257" ]
const b = [ '5cf296751771e6157cc2b257', '5cf2956b1771e6157cc2b256' ]
const c = _.intersection(a, b)
console.log(a)
// PlayerTwo.every(val => PlayerOne.includes(val));