const bcrypt = require('bcrypt');

// const hashPassword = async(password) => {
//     const salt = await bcrypt.genSalt(12);
//     const hash = await bcrypt.hash(password, salt)
//     console.log(salt);
//     console.log(hash);
// }

const hashPassword = async(password) => {
    const hash = await bcrypt.hash(password, 12)
    console.log(hash);
}


const login = async(password, hashedPassword) => {
    const result = await bcrypt.compare(password, hashedPassword);
    if (result) {
        console.log('Successful login!')
    }
    else {
        console.log('Try again!')
    }
}

hashPassword('monkey');
login('monkey', '$2b$12$KqjN7s4uOmqk/DAo6r98ge8VuoEU6PPcZqgAIfUPhJxlMpwDa1MF.')