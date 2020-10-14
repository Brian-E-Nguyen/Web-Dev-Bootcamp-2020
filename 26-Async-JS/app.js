//-------------------
// The Call Stack
const multiply = (x, y) => x * y;

const square = x => multiply(x, x);

const isRightTriangle = (a, b, c) => (
    square(a) + square(b) === square(c)
)

isRightTriangle(3, 4, 5);

//-------------------
// WebAPI's & Single Threaded
console.log('SENDING REQUEST TO SERVER');
setTimeout(() => {
    console.log('Here is your data from the server...')
}, 3000);
console.log('I AM AT THE END OF THE FILE!')