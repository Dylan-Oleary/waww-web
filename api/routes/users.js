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

router.route("/:userID")
    .get((request, response) => {
        const authenticationID = requestAuthentication(request.headers.authorization);

        if(authenticationID){
            User.findById(authenticationID).then(result => {
                const token = jwt.sign({ id: authenticationID }, secret, {
                    expiresIn: "1h"
                });

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
                response.sendStatus(500);
            })
        } else {
            response.sendStatus(401);
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
                const token = jwt.sign({ id: result._id }, secret, {
                    expiresIn: "1h"
                });

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
            }).catch(error => {
                response.sendStatus(500);
            });
        } else {
            response.sendStatus(401);
        }
    })
    .delete((request, response) => {
        const authenticationID = requestAuthentication(request.headers.authorization);

        if(authenticationID){
            User.deleteOne({ _id: authenticationID }).then(() => {
                response.sendStatus(200);
            }).catch(error => {
                response.sendStatus(500);
            });
        } else {
            response.sendStatus(401);
        }
    })
; // close router.route("/:userID")

//UPDATE QUEUE
router.post("/watchlist", async (req, res) => {
  //If no JWT, send alert message
  if(req.body.jwt === null ){
    alert.alertMessages = ["You must log in before adding movies to your lists!"];
    alert.alertFor = "nullJWT";

    res.status(401).send({ alert });
  }else {
    const userJWT = jwt.verify(req.body.jwt, process.env.TOKEN_SECRET);
    const movie = req.body.movie

    //Check if movie appears in Watch List - if it doesn't add it, if it does remove it
    const watchListMovie = await User.findById(userJWT.id)
        .then(user => {
            for(let i = 0; i < user.watchlist.length; i++){
                if(user.watchlist[i]._id === movie._id){
                    return user.watchlist[i];
                }
            }
        })
        .catch(() => {
          alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
          alert.alertFor = "DB ERROR"
    
          res.status(502).send({ alert });
        })

    if(!watchListMovie){
      User.updateOne({
        _id: userJWT.id
      },{
        $push: {
          watchlist: {
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              title: movie.title
          },
          recentActivity: {
            $each: [{ 
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              title: movie.title,
              message: `added to your backlog`,
              date: new Date(),
              release_date: movie.release_date
            }],
            $slice: -15
          }
        }
      })
      .then(() => {
        alert.alertMessages = [`${movie.title} has been successfully added to your WatchList!`];
        alert.alertFor = "addToWatchList"

        res.status(200).send({ alert });
      })
      .catch(() => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "DB ERROR"
  
        res.status(502).send({ alert });
      })
    } else {
      //If it is on the Watch List, remove it
      User.updateOne({
        _id: userJWT.id
      },{
        $pull: {
          watchlist: {
            _id: movie._id,
            tmdb_id: movie.tmdb_id,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            title: movie.title
          }
        },
        $push : {
          recentActivity: {
            $each: [{ 
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              title: movie.title,
              message: `removed from your backlog`,
              date: new Date(),
              release_date: movie.release_date
            }],
            $slice: -15
          }
        }
      })
      .then(() => {
        alert.alertMessages = [`${movie.title} has been successfully removed to your WatchList!`];
        alert.alertFor = "removeFromWatchList";

        res.status(200).send({ alert });
      })
      .catch(() => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "DB ERROR"
  
        res.status(502).send({ alert });
      })
    }
  }
});

//UPDATE FAVOURITES
router.post("/favourites", async (req, res) => {
  //If no JWT, send alert message
  if(req.body.jwt === null ){
    alert.alertMessages = ["You must log in before adding movies to your lists!"];
    alert.alertFor = "nullJWT";

    res.status(401).send({ alert });
  }else {
    const userJWT = jwt.verify(req.body.jwt, process.env.TOKEN_SECRET);
    const movie = req.body.movie

    //Check if movie appears in Watch List - if it doesn't add it, if it does remove it
    const favouriteMovie = await User.findById(userJWT.id)
        .then(user => {
            for(let i = 0; i < user.favourites.length; i++){
                if(user.favourites[i]._id === movie._id){
                    return user.favourites[i];
                }
            }
        })
        .catch(err => {
          alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
          alert.alertFor = "DB ERROR"
    
          res.status(502).send({ alert });
        })

    if(!favouriteMovie){
      User.updateOne({
        _id: userJWT.id
      },{
        $push: {
          favourites: {
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              title: movie.title
          },
          recentActivity: {
            $each: [{ 
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              title: movie.title,
              message: `added to your favourites`,
              date: new Date(),
              release_date: movie.release_date
            }],
            $slice: -15
          }
      }
      })
      .then(() => {
        alert.alertMessages = [`${movie.title} has been successfully added to your Favourites!`];
        alert.alertFor = "addToFavourites";

        res.status(200).send({ alert });
      })
      .catch( err => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "DB ERROR"
  
        res.status(403).send({ alert });
      })
    } else {
      //If it is in Favourites, remove it
      User.updateOne({
        _id: userJWT.id
      },{
        $pull: {
          favourites: {
            _id: movie._id,
            tmdb_id: movie.tmdb_id,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            title: movie.title,
          }
        },
        $push : {
          recentActivity: {
            $each: [{ 
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              title: movie.title,
              message: `removed from your favourites`,
              date: new Date(),
              release_date: movie.release_date
            }],
            $slice: -15
          }
        }
      })
      .then( () => {
        alert.alertMessages = [`${movie.title} has been successfully removed from your Favourites!`];
        alert.alertFor = "removeFromFavourites";

        res.status(200).send({ alert });
      })
      .catch(() => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "DB ERROR"
  
        res.status(403).send({ alert });
      })
    }
  }
});

//UPDATE LOG
router.post("/viewed", async (req, res) => {
  //If no JWT, send alert message
  if(req.body.jwt === null ){
    alert.alertMessages = ["You must log in before adding movies to your lists!"];
    alert.alertFor = "nullJWT";

    res.status(401).send({ alert });
  }else {
    const userJWT = jwt.verify(req.body.jwt, process.env.TOKEN_SECRET);
    const movie = req.body.movie

    //Check if movie appears in ViewedList - if it doesn't add it, if it does remove it
    const viewedMovie = await User.findById(userJWT.id)
        .then(user => {
            for(let i = 0; i < user.viewed.length; i++){
                if(user.viewed[i]._id === movie._id){
                    return user.viewed[i];
                }
            }
        })
        .catch(err => {
          alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
          alert.alertFor = "DB ERROR"
    
          res.status(502).send({ alert });
        })

    if(!viewedMovie){
      User.updateOne({
        _id: userJWT.id
      },{
        $push: {
          viewed: {
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              title: movie.title
          },
          recentActivity: {
            $each: [{ 
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              title: movie.title,
              message: `added to your log`,
              date: new Date(),
              release_date: movie.release_date
            }],
            $slice: -15
          }
      }
      })
      .then(() => {
        alert.alertMessages = [`${movie.title} has been successfully added to your ViewedList!`];
        alert.alertFor = "addToViewed";

        res.status(200).send({ alert });
      })
      .catch( err => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "DB ERROR"
  
        res.status(403).send({ alert });
      })
    } else {
      //If it is in Viewed, remove it
      User.updateOne({
        _id: userJWT.id
      },{
        $pull: {
          viewed: {
            _id: movie._id,
            tmdb_id: movie.tmdb_id,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            title: movie.title,
          }
        },
        $push: {
          recentActivity: {
            $each: [{ 
              _id: movie._id,
              tmdb_id: movie.tmdb_id,
              title: movie.title,
              message: `removed from your log`,
              date: new Date(),
              release_date: movie.release_date
            }],
            $slice: -15
          }
        }
      })
      .then( () => {
        alert.alertMessages = [`${movie.title} has been successfully removed from your ViewedList!`];
        alert.alertFor = "removeFromViewed";

        res.status(200).send({ alert });
      })
      .catch(() => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "DB ERROR"
  
        res.status(403).send({ alert });
      })
    }
  }
})

module.exports = router;