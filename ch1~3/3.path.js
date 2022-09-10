const path = require('path');

console.log(path.join(__dirname, '..', '/var.js')); // join은 경로를 전부 표시
console.log(path.resolve(__dirname, '..', '/var.js'));// resolve는 절대 경로간다 /var.js만 표시'
