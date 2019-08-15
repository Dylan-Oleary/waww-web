const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const secret = process.env.TOKEN_SECRET;

const alert = {
    alertMessages: [],
    alertFor: null
}

router.post("/persist", (req, res) => {    
    const userJWT = jwt.verify(req.body.jwt, process.env.TOKEN_SECRET);
    //CHECK IF TIME HAS EXPIRED ON JWT SO WE CAN KICK THEM OUT AND CLEAR LOCAL
    
    User.findOne({
        _id: userJWT.id
    })
    .then( user => {
        const authenticatedUser = {
            profilePicture: user.profilePicture,
            watchlist: user.watchlist,
            favourites: user.favourites,
            viewed: user.viewed,
            ratedList: user.ratedList,
            genres: user.genres,
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            recentActivity: user.recentActivity,
            recentlyVisited: user.recentlyVisited
        }

        res.status(200).send({ authenticatedUser });
    })
    .catch( () => {
        alert.alertMessages = ["Please login to view this content"];
        alert.alertFor = "nullJWT";

        res.status(409).send({ alert });
    })
})

router.post("/authenticate", (req, res, next) => {
    User.findOne({
        email: req.body.user.email
    })
    .then( user => {
        const password = req.body.formValues ? req.body.formValues.password : req.body.user.password;

        user.authenticate(password, (err, isMatch) => {
            if(err) throw new Error(err);

            if (isMatch){
                const payload = { 
                    id: user._id
                };

                const token = jwt.sign(payload, secret, {
                  expiresIn: '8h'
                });

                const authenticatedUser = {
                    profilePicture: user.profilePicture,
                    watchlist: user.watchlist,
                    favourites: user.favourites,
                    viewed: user.viewed,
                    genres: user.genres,
                    ratedList: user.ratedList,
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    username: user.username,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    recentActivity: user.recentActivity,
                    recentlyVisited: user.recentlyVisited
                }
                
                alert.alertMessages = [`Welcome, ${authenticatedUser.firstName}!`];
                alert.alertFor = "successfulLogin"

                res.status(200).send({ authenticatedUser, token, alert });
            } else {
                alert.alertMessages = ["E-mail and/or password are invalid!"]
                alert.alertFor = "invalidCredentials";

                res.status(409).send({ alert });
            }
        })
    })
    .catch( () => {
        alert.alertMessages = ["An account with this e-mail does not exist!"]
        alert.alertFor = "invalidCredentials";

        res.status(400).send({ alert });
    });
});

module.exports = router;