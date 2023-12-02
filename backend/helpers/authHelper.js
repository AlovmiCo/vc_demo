const bcrypt = require("bcryptjs");

const hashPassword = (password) => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

const comparePassword = (password, hashed) => {
    return bcrypt.compareSync(password, hashed);
}

module.exports = { hashPassword, comparePassword }