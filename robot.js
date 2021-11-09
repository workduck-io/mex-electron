const { selectInput } = require('aws-amplify');
const robot = require('robotjs')
const key = 'c';
/*
for(var c = 'a'.charCodeAt(0); c <= 'z'.charCodeAt(0); c++) {
  keys.push(String.fromCharCode(c));
}
*/

robot.keyTap('c', 'control')
