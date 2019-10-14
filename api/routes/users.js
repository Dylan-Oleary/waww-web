const router = require("express").Router();
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const secret = process.env.TOKEN_SECRET;
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const requestAuthentication = require("../utils/isAuthenticated");
const cloudinary = require("../config/cloudinary");
const upload = require("../config/multer");

router.route([ "/:userID/watchlist", "/:userID/favourites", "/:userID/viewed" ])
    .get((request, response) => {
        const authenticationID = requestAuthentication(request.headers.authorization);

        if(authenticationID){
            User.findById(authenticationID).then(user => {
                const listType = request.path.split("/")[2];
                const token = jwt.sign({ id: result._id }, secret, { expiresIn: "1h" });
                const list = user[listType];

                response.status(200).send({ token, list });
            }).catch(() => {
                response.status(500).send({ message: "Woops! Something went wrong on our end! Please try again" });
            });
        } else {
            response.status(401).send({ message: "Authentication error!" });
        }
    })
    .post((request, response) => {
        const authenticationID = requestAuthentication(request.headers.authorization);

        if(authenticationID){
            User.findById(authenticationID).then(user => {
                const listType = request.path.split("/")[2];
                const movieRecord = user[listType].filter(movie => movie._id === request.body._id)[0];

                if(movieRecord !== null && movieRecord !== undefined){
                    response.status(400).send({ message: "This movie already exists in the list that it is trying to be added to!" });
                } else {
                    User.findOneAndUpdate(authenticationID, {
                        $push: {
                            [listType]: {
                                _id: request.body._id,
                                poster_path: request.body.poster_path,
                                release_date: request.body.release_date,
                                title: request.body.title
                            },
                            recentActivity: {
                                $each: [{
                                    _id: request.body._id,
                                    title: request.body.title,
                                    release_date: request.body.release_date,
                                    body: `added to your ${listType}`,
                                    date: new Date()
                                }],
                                $slice: -15
                            }
                        }
                    },{
                        runValidators: true,
                        new: true
                    }).then(result => {
                        const token = jwt.sign({ id: result._id }, secret, { expiresIn: "1h" });
                        const user = {
                            _id: result._id,
                            firstName: result.firstName,
                            lastName: result.lastName,
                            email: result.email,
                            username: result.username,
                            createdAt: result.createdAt,
                            updatedAt: result.updatedAt,
                            reviews: result.reviews,
                            recentlyVisited: result.recentlyVisited,
                            recentActivity: result.recentActivity,
                            genres: result.genres,
                            viewed: result.viewed,
                            favourites: result.favourites,
                            watchlist: result.watchlist,
                            profilePicture: {
                                publicID: result.profilePicture.publicID,
                                secureURL: result.profilePicture.secureURL
                            }
                        };

                        response.status(200).send({ token, user });
                    }).catch(() => {
                        response.status(500).send({ message: "Woops! Something went wrong on our end! Please try again" });
                    });
                }
            }).catch(() => {
                response.status(500).send({ message: "Woops! Something went wrong on our end! Please try again" });
            });
        } else {
            response.status(401).send({ message: "Authentication error!" });
        }
    })
; //close router.route([ "/watchlist", "/favourites", "/viewed" ])

router.route([ "/:userID/watchlist/:movieID", "/:userID/favourites/:movieID", "/:userID/viewed/:movieID" ])
    .delete((request, response) => {
        const authenticationID = requestAuthentication(request.headers.authorization);

        if(authenticationID){
            User.findById(authenticationID).then(user => {
                const listType = request.path.split("/")[2];
                const movieRecord = user[listType].filter(movie => movie._id === parseInt(request.params.movieID))[0];

                if(movieRecord === null || movieRecord === undefined){
                    response.status(400).send({ message: "The movie that is attempting to be deleted does not exist in this list" });
                } else {
                    User.findOneAndUpdate(authenticationID, {
                        $pull: {
                            [listType]: {
                                _id: movieRecord._id,
                                title: movieRecord.title,
                                poster_path: movieRecord.poster_path,
                                release_date: movieRecord.release_date
                            }
                        },
                        $push: {
                            recentActivity: {
                                $each: [{
                                    _id: movieRecord._id,
                                    title: movieRecord.title,
                                    release_date: movieRecord.release_date,
                                    body: `removed from your ${listType}`,
                                    date: new Date()
                                }],
                                $slice: -15
                            }
                        }
                    }, {
                        runValidators: true,
                        new: true
                    }).then(result => {
                        const token = jwt.sign({ id: result._id }, secret, { expiresIn: "1h" });
                        const user = {
                            _id: result._id,
                            firstName: result.firstName,
                            lastName: result.lastName,
                            email: result.email,
                            username: result.username,
                            createdAt: result.createdAt,
                            updatedAt: result.updatedAt,
                            reviews: result.reviews,
                            recentlyVisited: result.recentlyVisited,
                            recentActivity: result.recentActivity,
                            genres: result.genres,
                            viewed: result.viewed,
                            favourites: result.favourites,
                            watchlist: result.watchlist,
                            profilePicture: {
                                publicID: result.profilePicture.publicID,
                                secureURL: result.profilePicture.secureURL
                            }
                        };

                        response.status(200).send({ token, user });
                    }).catch(() => {
                        response.status(500).send({ message: "Woops! Something went wrong on our end! Please try again" });
                    });
                }
            }).catch(() => {
                response.status(500).send({ message: "Woops! Something went wrong on our end! Please try again" });
            })
        } else {
            response.status(401).send({ message: "Authentication error!" });
        }
    })
; ///close router.route([ "/watchlist/:movieID", "/favourites/:movieID", "/viewed/:movieID" ])

router.route("/:userID")
    .get((request, response) => {
        const authenticationID = requestAuthentication(request.headers.authorization);

        if(authenticationID){
            User.findById(authenticationID).then(result => {
                const token = jwt.sign({ id: authenticationID }, secret, { expiresIn: "1h" });
                const user = {
                    _id: result._id,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    email: result.email,
                    username: result.username,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                    reviews: result.reviews,
                    recentlyVisited: result.recentlyVisited,
                    recentActivity: result.recentActivity,
                    genres: result.genres,
                    viewed: result.viewed,
                    favourites: result.favourites,
                    watchlist: result.watchlist,
                    profilePicture: {
                        publicID: result.profilePicture.publicID,
                        secureURL: result.profilePicture.secureURL
                    }
                };

                response.status(200).send({ token, user });
            }).catch(() => {
                response.status(500).send({ message: "Woops! Something went wrong on our end! Please try again" });
            })
        } else {
            response.status(401).send({ message: "Authentication error!" });
        }
    })
    .put(upload.single("file"), (request, response) => {
        const authenticationID = requestAuthentication(request.headers.authorization);

        if(authenticationID){
            return new Promise((resolve, reject) => {
                if(request.file){
                    cloudinary.uploader.upload(request.file.path, {
                        width: 250,
                        height: 250,
                        crop: "fill"
                    }).then(cloudinaryResponse => {
                        User.findByIdAndUpdate(authenticationID, {
                            profilePicture: {
                                publicID: cloudinaryResponse.public_id,
                                secureURL: cloudinaryResponse.secure_url
                            }
                        }, {
                            runValidators: true,
                            new: true
                        }).then(user => {
                            unlinkAsync(request.file.path);
                            resolve(user);
                        }).catch(error => {
                            reject(error);
                        });
                    }).catch(error => {
                        reject(error);
                    })
                } else {
                    User.findByIdAndUpdate(authenticationID , request.body.formValues, {
                        runValidators: true,
                        new: true
                    }).then(user => {
                        resolve(user);
                    }).catch(error => {
                        reject(error);
                    });
                }
            }).then(result => {
                const token = jwt.sign({ id: result._id }, secret, { expiresIn: "1h" });
                const user = {
                    _id: result._id,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    email: result.email,
                    username: result.username,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                    reviews: result.reviews,
                    recentlyVisited: result.recentlyVisited,
                    recentActivity: result.recentActivity,
                    genres: result.genres,
                    viewed: result.viewed,
                    favourites: result.favourites,
                    watchlist: result.watchlist,
                    profilePicture: {
                        publicID: result.profilePicture.publicID,
                        secureURL: result.profilePicture.secureURL
                    }
                };

                response.status(200).send({ token, user });
            }).catch(() => {
                response.status(500).send({ message: "Woops! Something went wrong on our end! Please try again" });
            });
        } else {
            response.status(401).send({ message: "Authentication error!" });
        }
    })
    .delete((request, response) => {
        const authenticationID = requestAuthentication(request.headers.authorization);

        if(authenticationID){
            User.deleteOne({ _id: authenticationID }).then(() => {
                response.sendStatus(200);
            }).catch(() => {
                response.status(500).send({ message: "Woops! Something went wrong on our end! Please try again" });
            });
        } else {
            response.status(401).send({ message: "Authentication error!" });
        }
    })
; // close router.route("/:userID")

module.exports = router;