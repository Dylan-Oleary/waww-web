const router = require("express").Router();
const jwt = require("jsonwebtoken");
const secret = process.env.TOKEN_SECRET;
const User = require("../models/user");
const requestAuthentication = require("../utils/isAuthenticated");

router.route("/")
    .get((request, response) => {
        const authenticationID = requestAuthentication(request.headers.authorization);

        if(authenticationID){
            User.findById(authenticationID).then(user => {
                const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
                const authenticatedUser = {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    username: user.username,
                    watchlist: user.watchlist,
                    favourites: user.favourites,
                    viewed: user.viewed,
                    genres: user.genres,
                    profilePicture: {
                        publicID: user.profilePicture.publicID,
                        secureURL: user.profilePicture.secureURL
                    },
                    recentlyVisited: user.recentlyVisited,
                    recentActivity: user.recentActivity,
                    reviews: user.reviews,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                };

                response.status(200).send({ authenticatedUser, token });
            }).catch(error => {
                response.status(500).send(error);
            });
        } else {
            response.sendStatus(200);
        }
    })
; // close router.route("/")

router.route("/authenticate")
    .post((request, response) => {
        User.findOne({
            email: request.body.user.email
        }).then(user => {
            const password = request.body.user.password;
    
            return new Promise((resolve, reject) => {
                user.authenticate(password, (error, isMatch) => {
                    if(error) throw new Error(error);
        
                    if (isMatch){
                        resolve(user);
                    } else {
                        reject();
                    }
                });
            }).then(user => {
                const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
                const authenticatedUser = {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    username: user.username,
                    watchlist: user.watchlist,
                    favourites: user.favourites,
                    viewed: user.viewed,
                    genres: user.genres,
                    profilePicture: {
                        publicID: user.profilePicture.publicID,
                        secureURL: user.profilePicture.secureURL
                    },
                    recentlyVisited: user.recentlyVisited,
                    recentActivity: user.recentActivity,
                    reviews: user.reviews,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                };

                response.status(200).send({ authenticatedUser, token });
            }).catch(error => {
                response.status(401).send(error);
            });
        }).catch(error => {    
            response.status(404).send(error);
        });
    })
; // close router.route("/authenticate")

router.route("/register")
    .post((request, response) => {
        User.findOne({
            $or: [
                {"username": request.body.newUser.username},
                {"email": request.body.newUser.email}
            ]
        }).then(user => {
            if(user){
                let errors = [];
                if(user.username === request.body.newUser.username){
                    errors.push("A user with this user name already exists!");
                }
                if(user.email === request.body.newUser.email){
                    errors.push("A user with this email already exists!");
                }

                response.status(409).send(errors);
            } else {
                User.create({
                    firstName: request.body.newUser.firstName,
                    lastName: request.body.newUser.lastName,
                    email: request.body.newUser.email,
                    username: request.body.newUser.username,
                    password: request.body.newUser.password,
                    confirmPassword: request.body.newUser.confirmPassword,
                    watchlist: [],
                    favourites: [],
                    viewed: [],
                    genres: [],
                    recentlyVisited: [],
                    recentActivity: [],
                    reviews: []
                }).then(user => {
                    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
                    const authenticatedUser = {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        username: user.username,
                        watchlist: user.watchlist,
                        favourites: user.favourites,
                        viewed: user.viewed,
                        genres: user.genres,
                        profilePicture: {
                            publicID: user.profilePicture.publicID,
                            secureURL: user.profilePicture.secureURL
                        },
                        recentlyVisited: user.recentlyVisited,
                        recentActivity: user.recentActivity,
                        reviews: user.reviews,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt
                    };

                    response.status(201).send({ authenticatedUser, token });
                }).catch(error => {
                    response.status(500).send(error);
                });
            }
        }).catch(error => {
            response.status(500).send(error);
        });
    })
; //close router.route("/register")

module.exports = router;