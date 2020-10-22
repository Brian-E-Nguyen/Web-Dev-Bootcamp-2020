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

//-------------------
// Callback Hell :(

setTimeout(() => {
    document.body.style.backgroundColor = 'red';
    setTimeout(() => {
        document.body.style.backgroundColor = 'orange';
        setTimeout(() => {
            document.body.style.backgroundColor = 'yellow';
            setTimeout(() => {
                document.body.style.backgroundColor = 'green';
                setTimeout(() => {
                    document.body.style.backgroundColor = 'blue';
                    setTimeout(() => {
                        document.body.style.backgroundColor = 'purple';
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}, 1000)

// setTimeout(() => {
//     document.body.style.backgroundColor = 'orange'
// }, 2000)
// document.body.style.backgroundColor = 'orange'