const jwt = require("jsonwebtoken");

module.exports = (token) => {
    return jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
        if(error){
            return false;
        } else {
            if(decoded.id){
                return decoded.id;
            }
        }
    });
};