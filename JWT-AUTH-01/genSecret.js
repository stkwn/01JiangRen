const crypto = require("crypto");

const generate_secret= () =>{
    return crypto.randomBytes(64).toString('hex')
}

console.log(generate_secret());

