const value = require('./1.var.js');

console.log(value);


const {odd, even} = require('./1.var.js'); // 구조분해 할당

function cheekOddOrEven(number){
    if (number % 2){
        return odd;
    }
    else{
        return even;
    }
}